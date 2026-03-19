/**
 * Plugin: Resource Monitor
 * Shows CPU and RAM usage for the player and its children (mpv, etc.)
 */

const { exec } = require("child_process");

module.exports = {
  name: "resource-monitor",
  init(player) {
    let timer = null;

    const updateStats = () => {
      // Get all pids in the process group
      // On Linux/Android (Termux), we can use 'ps -o pid,ppid,rss,%cpu,comm'
      // We want to find processes that have the player PID as parent or are the player itself
      const playerPid = process.pid;

      // We also want to include the mpv process
      const mpvPid = player.mpv && player.mpv.proc ? player.mpv.proc.pid : null;

      exec("ps -o pid,ppid,rss,%cpu,comm", (err, stdout) => {
        if (err) return;

        const lines = stdout.trim().split("\n").slice(1);
        let totalRss = 0;
        let totalCpu = 0;
        let procCount = 0;
        const pids = new Set();
        pids.add(playerPid);
        if (mpvPid) pids.add(mpvPid);

        // First pass: find all direct children and collect stats for known pids
        // We do multiple passes to find grandchildren if any
        let changed = true;
        while (changed) {
          changed = false;
          for (const line of lines) {
            const [pidStr, ppidStr] = line.trim().split(/\s+/);
            const pid = parseInt(pidStr);
            const ppid = parseInt(ppidStr);
            if (pids.has(ppid) && !pids.has(pid)) {
              pids.add(pid);
              changed = true;
            }
          }
        }

        // Second pass: sum stats for all pids in our set
        for (const line of lines) {
          const [pidStr, ppidStr, rssStr, cpuStr, ...commParts] = line
            .trim()
            .split(/\s+/);
          const pid = parseInt(pidStr);
          if (pids.has(pid)) {
            totalRss += parseInt(rssStr) || 0;
            totalCpu += parseFloat(cpuStr) || 0;
            procCount++;
          }
        }

        const memStr = (totalRss / 1024).toFixed(1) + "MB";
        const cpuStrFixed = totalCpu.toFixed(1) + "%";

        player.st.resourceUsage = `Procs: ${procCount} | CPU: ${cpuStrFixed} | RAM: ${memStr}`;
        // No need to force redraw, the main loop does it,
        // but we can trigger update for immediate feedback if needed
        player.emit("update");
      });
    };

    // Update every 3 seconds
    timer = setInterval(updateStats, 3000);
    updateStats();

    // Cleanup on quit
    const originalQuit = player._quit;
    player._quit = async function () {
      if (timer) clearInterval(timer);
      if (originalQuit) return originalQuit.apply(this, arguments);
    };
  },
};
