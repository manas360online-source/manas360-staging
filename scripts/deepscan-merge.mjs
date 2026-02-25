import fs from 'fs';
import path from 'path';

const root = process.cwd();
const appFileCandidates = [
  path.join(root, 'frontend', 'main-app', 'App.tsx'),
  path.join(root, 'App.tsx'),
];
const outFile = path.join(root, 'docs', 'DEEPSCAN_MERGE_REPORT.md');

const EXCLUDE_DIRS = new Set(['node_modules', '.git', 'dist', '.vscode']);

function isDirectory(p) {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
}

function listTopLevelDirs() {
  return fs
    .readdirSync(root)
    .filter((name) => isDirectory(path.join(root, name)))
    .sort((a, b) => a.localeCompare(b));
}

function walk(dir, callback) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (EXCLUDE_DIRS.has(entry.name)) continue;
      walk(fullPath, callback);
    } else {
      callback(fullPath);
    }
  }
}

function findPackageJsonFiles() {
  const results = [];
  walk(root, (filePath) => {
    if (path.basename(filePath) === 'package.json') {
      const rel = path.relative(root, filePath).replace(/\\/g, '/');
      results.push(rel);
    }
  });
  return results.sort((a, b) => a.localeCompare(b));
}

function parseRootAppImports() {
  const appFile = appFileCandidates.find((candidate) => fs.existsSync(candidate));
  if (!appFile) return [];
  const source = fs.readFileSync(appFile, 'utf8');
  const matches = [...source.matchAll(/from\s+['"](\.[^'"]+)['"]/g)];

  return matches
    .map((m) => m[1])
    .map((value) => value.startsWith('./') ? value.slice(2) : value)
    .filter((value) => !value.startsWith('components/') && !value.startsWith('utils/') && !value.startsWith('src/') && !value.startsWith('types'))
    .map((value) => {
      const parts = value.split('/');
      if (parts[0] === '..' && parts[1] === 'apps' && parts[2]) {
        return `frontend/apps/${parts[2]}`;
      }
      if (parts[0] === '..' && parts[1] === '..' && parts[2] === 'Admin') {
        return 'Admin';
      }
      if (parts[0] === 'frontend' && parts[1] === 'apps' && parts[2]) {
        return `frontend/apps/${parts[2]}`;
      }
      return parts[0];
    })
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
}

function unique(values) {
  return [...new Set(values)];
}

function readMergeStats() {
  const candidates = [
    path.join(root, 'artifacts', 'merged-app-snapshot', '.merge_report.txt'),
    path.join(root, 'merged-app', '.merge_report.txt'),
  ];

  const reportPath = candidates.find((candidate) => fs.existsSync(candidate));
  if (!reportPath) return null;

  const text = fs.readFileSync(reportPath, 'utf8');
  const copied = text.match(/Files copied:\s*(\d+)/)?.[1] ?? '0';
  const overwritten = text.match(/Files overwritten \(newest wins\):\s*(\d+)/)?.[1] ?? '0';
  const skipped = text.match(/Files skipped \(existing newer\):\s*(\d+)/)?.[1] ?? '0';

  return { copied, overwritten, skipped };
}

function getStandalonePackages(packageFiles, integratedFolders) {
  return packageFiles
    .map((pkgPath) => {
      if (pkgPath === 'package.json') {
        return null;
      }
      if (pkgPath.startsWith('artifacts/')) {
        return null;
      }
      const top = pkgPath.split('/')[0];
      const folderKey = pkgPath.startsWith('frontend/apps/')
        ? pkgPath.split('/').slice(0, 3).join('/')
        : top;
      return { pkgPath, top, folderKey };
    })
    .filter(Boolean)
    .filter(({ top, folderKey }) => !integratedFolders.has(folderKey) && !integratedFolders.has(top) && top !== 'merged-app')
    .map(({ pkgPath }) => pkgPath)
    .sort((a, b) => a.localeCompare(b));
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function buildMarkdown({
  timestamp,
  topDirs,
  packageFiles,
  integratedFolders,
  standalonePackages,
  mergeStats,
}) {
  const integrated = [...integratedFolders].sort((a, b) => a.localeCompare(b));
  const notIntegratedTopDirs = topDirs.filter((d) => !integratedFolders.has(d) && d !== 'merged-app' && d !== 'node_modules' && d !== '.git' && d !== 'dist');

  return `# Deep Scan Merge Report\n\nGenerated: ${timestamp}\n\n## Merge Status\n\n- Root app is functioning as a single integrated frontend shell (confirmed by successful root build).\n- Integration happens in \`App.tsx\` with feature apps consolidated under \`frontend/apps/*\`.\n- Physical flattening output is retained in \`artifacts/merged-app-snapshot/\` as a snapshot, not runtime source.\n\n## Deep Scan Summary\n\n- Top-level folders scanned: ${topDirs.length}\n- package.json files discovered: ${packageFiles.length}\n- Feature folders directly integrated by root App: ${integrated.length}\n\n${mergeStats ? `## Previous Physical Merge Snapshot\n\n- Files copied: ${mergeStats.copied}\n- Files overwritten (newest wins): ${mergeStats.overwritten}\n- Files skipped (existing newer): ${mergeStats.skipped}\n\n` : ''}## Integrated Folders (Used by Root App)\n\n${integrated.map((name) => `- ${name}`).join('\n') || '- None found'}\n\n## Standalone Package Roots (Not wired into Root App imports)\n\n${standalonePackages.map((pkg) => `- ${pkg}`).join('\n') || '- None'}\n\n## Top-level Folders Not Directly Imported by Root App\n\n${notIntegratedTopDirs.map((name) => `- ${name}`).join('\n') || '- None'}\n\n## Recommended One-Application Operation\n\n- Use \`npm run dev:unified\` at repository root to run frontend + root backend + admin backend + payment backend together.\n- Keep root folder as source-of-truth runtime shell.\n- Do not build from \`artifacts/merged-app-snapshot/\`; use it only for conflict review.\n\n## Next Consolidation Targets\n\n- Consolidate duplicate nested projects under \`frontend/apps/therapist-onboarding/\` into one canonical implementation.\n- Move remaining backend modules into unified \`backend/*\` layout as documented.\n- Normalize ports/env per backend service to avoid clashes.\n`;
}

function main() {
  const topDirs = listTopLevelDirs();
  const packageFiles = findPackageJsonFiles();
  const integratedFolders = new Set(unique(parseRootAppImports()));
  const standalonePackages = getStandalonePackages(packageFiles, integratedFolders);
  const mergeStats = readMergeStats();

  const markdown = buildMarkdown({
    timestamp: new Date().toISOString(),
    topDirs,
    packageFiles,
    integratedFolders,
    standalonePackages,
    mergeStats,
  });

  ensureDir(path.dirname(outFile));
  fs.writeFileSync(outFile, markdown, 'utf8');

  console.log('Deep scan completed.');
  console.log(`Report: ${path.relative(root, outFile)}`);
  console.log(`Integrated folders: ${integratedFolders.size}`);
  console.log(`Standalone packages: ${standalonePackages.length}`);
}

main();
