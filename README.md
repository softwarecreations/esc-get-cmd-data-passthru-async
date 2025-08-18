# esc-get-cmd-data-passthru-async

Run any shell command, get promise resolving/rejecting (or only resolving) with

* Return code
* Arrays of stdout/stderr

Optional
* Line positive/negative filtering [ function / string / regex ]
* Data-extraction/transformation [ function / regex ]
* Realtime pass-through (user can see cmd progress)
* Error handling, however you want

## Not for interactive commands (eg: nano)

For interactive commands, use: [esc-get-interactive-cmd-result-async](https://www.npmjs.com/package/esc-get-interactive-cmd-result-async)

## Install

```sh
npm install esc-get-cmd-data-passthru-async
```

## Usage

Run a command and get its output as arrays. Includes powerful options for filtering, mapping, and environment control.

### Silly examples with familiar commands

**List files, filter, and capture output:**

```js
import { getCmdDataP } from 'esc-get-cmd-data-passthru-async';

(async () => {
  try {
    const [ retCode, outA, errA ] = await getCmdDataP(
      'ls',
      ['-la'],
      {
        cwd: '/tmp/foo',
        passthru: true,                            // Print output live (default: true)
        filterOnly: line => line.endsWith('.txt'), // Only .txt files
        capture: line => line.toUpperCase(),       // Convert to uppercase
        env: { DEBUG: '1' },
        verbosity: 3,                              // Verbose logs (default: 3)
      }
    );
    console.log('retCode:', retCode);
    console.log('Stdout array:', outA);
    console.log('Stderr array:', errA);
  } catch ([ retCode, outA, errA ]) {
    console.error('retCode', retCode);
    console.log('Stdout array:', outA);
    console.log('Stderr array:', errA);
  }
})();
```

### Silly one line examples

```js
const [ retCode, outA, errA ] = await runP('apt', ['update'], { capture:/https?:\/\/[^ ]+/ }); // get only the apt URL's
```

```js
const [ retCode, outA, errA ] = await runP('apt', ['update'], { filterOnly:'Hit', filterNot:'debian.org/' }); // Only get the lines containing Hit, but not the debian.org related lines.
```

```js
const [ retCode, outA, errA ] = await runP('apt', ['update'], { filterOnly:/(E|Err):/ }); // get only the apt URL's
```

```js
const [ retCode, outA, errA ] = await runP('df', ['-h'], { filterOnly:/(^Filesystem | \/$)/ }); // Get the headings and only the root filesystem's stats
```

```js
const [ retCode, outA, errA ] = await runP('zfs', ['list','yourmom'], { filterNot:/^NAME / });
```

## API

### `getCmdDataP(cmd, argsA=[], optionsO={})`

- **cmd**: _String_ – Command to run.
- **argsA**: _Array&lt;string&gt;_ – Command arguments.
- **optionsO**: _Object_
  - **passthru**: _Boolean_ (default: true) – Print stdout/stderr to terminal live.
  - **filterOnly**: _Function/RegExp/String_ – Include only lines matching this.
  - **filterNot**:  _Function/RegExp/String_ – Exclude lines matching this.
  - **capture**:    _Function/RegExp_ – Map/transforms each line before collecting.
  - **verbosity**:  _0-3_ (default:3) – Control log output:
    - 0:silent, 1:errors, 2:show commands, 3:show success
  - **env**:        _Object_ – Extra environment variables (merged with `process.env`).
  - **spawnO**:     _Object_ – Additional options for [`child_process.spawn`](https://nodejs.org/api/child_process.html#child_processspawncommand-args-options).
  - **rejectOnError**: _Boolean_ (default:true) – Rejects promise on error/exit code != 0. If false, always resolves.

#### Returns

A Promise resolving to:

```js
[ exitCode, outA, errA ]
```

- _exitCode_: 0 on success; else reject with code > 0
- _outA_: Array of (possibly filtered/transformed) stdout lines
- _errA_: Array of (possibly filtered/transformed) stderr lines

## Features

- **No dependencies**: Simple, fast, small, no bloat.
- **Stable API**: No breaking changes will ever be made.
- **Passthrough**: See output live by default, or disable for silent/asynchronous capture.
- **Filtering/Mapping**: Pick or modify output lines with strings, RegExp, or functions.
- **Great for automation**: User can watch progress, calling script gets all of the data output.
- **No BS**: Get only the data that you need
- **Flexible Environment**: Pass custom env variables, cwd, etc.

## Typical Scenarios

- Running build scripts, CLI tools, or diagnostics within Node.js
- Filtering logs, capturing only what you want from output
- Replacing heavy solutions like `zx` with something lighter, safer, and more transparent

## License

MIT

---

**Say thanks by starring**: [esc-get-cmd-data-passthru-async on GitHub](https://github.com/softwarecreations/esc-get-cmd-data-passthru-async)  
**Issues & PRs welcome!**

---
