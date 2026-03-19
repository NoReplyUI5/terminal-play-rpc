# TUI PLAY

A professional TUI (Text User Interface) music player for Termux and Linux, featuring Discord Rich Presence (RPC), Termux media notification support, and synchronized lyrics display.

## ⚠️ Discord Token & ToS Warning

**CRITICAL: READ BEFORE USING DISCORD RPC**

This project uses a direct WebSocket gateway connection to update your Discord presence using a **User Token**.

- **Risk of Suspension**: Using a user token to automate account actions (including Rich Presence updates outside of the official desktop client) is considered "self-botting" and is a **violation of Discord's Terms of Service (ToS)**.
- **Account Security**: Never share your Discord token with anyone. It gives full access to your account.
- **Liability**: The developers and contributors of this project are not responsible for any actions taken against your Discord account. **Use this feature at your own risk.**

## 🍀 Termux User (must install Termux API)

- **[Download](https://github.com/termux/termux-api/releases)**: This allows Termux to create media controls.

```bash
apt install -y termux-api mpv ffmpeg
```

## 🎮 Usage

Start the player by passing a file or a folder:

```bash
node player.js /path/to/music
```

## ✨ Example

```bash
node player.js audio.m4a
```

### Keybindings

- `Space`: Pause / Resume
- `←` `→`: Seek ±10 seconds
- `Ctrl` + `←` `→`: Previous / Next track
- `↑` `↓` / `+` `−`: Volume Control
- `Ctrl` + `Alt` + `s`: Shuffle playlist/queue
- `Ctrl` + `l`: Toggle lyrics view
- `m`: Toggle Mute
- `r`: Cycle Repeat Mode (none → one → all)
- `s`: Toggle Shuffle
- `i`: Toggle File Info Panel
- `p`: Toggle Playlist Panel
- `q`: Quit

## 🍥 NPM packages (that are being used)

- **ws**: for Discord RPC (Packed inside player.js)
- **ncc**: to packed entire codebase into 1 file

## 📋 Requirements (must have)

- **Node.js**: v18 or later.
- **mpv**: Required as the audio backend.
- **ffprobe**: Optional (part of FFmpeg) for enhanced metadata.

## 🌟 Credits

### Core Tools

- **[mpv](https://mpv.io/)**: The powerful audio backend used for all media playback.
- **[ffprobe](https://ffmpeg.org/ffprobe.html)**: Used for extracting high-quality audio metadata and technical stream info.
- **[Termux_api](https://github.com/termux/termux-api/releases)**: This allows Termux to communicate with the Android system API.

### Development

- This project is **self-coded** by the author.
- Professional refactoring and modularization were performed using **Gemini CLI (AI Agent)** to optimize the codebase structure.

## 📄 License

MIT
