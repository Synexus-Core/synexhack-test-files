// synexus-init.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

console.log("🚀 Initializing Synexus Hackathon Workspace...");

try {
    // 0. Verify Node Environment
    const nodeVersion = process.version;
    console.log(`🟢 Detected Node Version: ${nodeVersion}`);
    if (parseInt(nodeVersion.replace('v', '').split('.')[0], 10) < 16) {
        console.warn("⚠️ WARNING: Node version is below 16. You might face compatibility issues.");
    }

    // 1. Install dependencies and activate Husky Git Hooks
    console.log("📦 Installing packages and activating Git hooks...");
    // Use --no-audit --no-fund to minimize errors/warnings in restrictive environments (e.g., campus labs)
    execSync('npm install --no-audit --no-fund', { stdio: 'inherit' });

    // 2. Check if the VS Code extension is installed
    console.log("🛡️ Verifying Synexus Shield Extension...");
    let extensionInstalled = false;
    try {
        const extensions = execSync('code --list-extensions', { stdio: 'pipe' }).toString();
        if (extensions.toLowerCase().includes('synexus-core.synexus-shield')) {
            extensionInstalled = true;
        }
    } catch (codeCmdError) {
        // Fallback: If 'code' command fails (e.g., not on PATH in Windows/macOS), check the extensions folder manually
        console.log("⚠️ 'code' CLI not found on PATH. Falling back to manual extension directory check...");
        const homeDir = os.homedir();
        const vscodeExtDir = path.join(homeDir, '.vscode', 'extensions');
        if (fs.existsSync(vscodeExtDir)) {
            const extFolders = fs.readdirSync(vscodeExtDir);
            if (extFolders.some(folder => folder.toLowerCase().includes('synexus-core.synexus-shield'))) {
                extensionInstalled = true;
            }
        }
    }

    if (!extensionInstalled) {
        console.log("\\n❌ ERROR: Synexus Shield VS Code Extension is NOT installed.");
        console.log("Please install it from the extensions tab before coding! Search for 'Synexus Shield'.");
        process.exit(1);
    } else {
        console.log("✅ Synexus Shield Extension verified.");
    }

    // 3. Verify compulsory files exist
    const requiredFiles = ['.cursorrules', '.secretlintrc.json', '.github/workflows/synexus-guard.yml', 'synexus-init.js'];
    let missingFiles = false;
    for (const file of requiredFiles) {
        if (!fs.existsSync(file)) {
            console.log(`\\n❌ ERROR: Missing compulsory file: ${file}`);
            console.log(`Run 'git checkout HEAD -- ${file}' or use the Extension's restore command to restore it.`);
            missingFiles = true;
        }
    }
    
    if (missingFiles) {
        process.exit(1);
    }

    console.log("\\n✅ ALL SYSTEMS GO! Your workspace is secured and ready.");
} catch (error) {
    console.log("\\n🚨 Setup failed. Please call an organizer for help.");
    console.error(error.message);
    process.exit(1);
}
