# esc-get-cmd-data-passthru-async

Run any shell command, get promise resolving/rejecting (or only resolving) with

* Return code
* Arrays of stdout/stderr

Optional
* Line filtering - positive/negative - using a [ function / string / regex ]
* Data-extraction/transformation - using a [ function / regex ]
* Pass-thru stdout/stderr (user can see cmd progress live)
* Error handling, however you want

## My other NPM modules for running commands

### Interactive (run and use nano/vim/installers/htop etc)

[esc-get-interactive-cmd-result-async](https://www.npmjs.com/package/esc-get-interactive-cmd-result-async)

### Capture stdout or get custom arrays on error afterwards

[esc-get-cmd-stdout-array-promise](https://www.npmjs.com/package/esc-get-cmd-stdout-array-promise)


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
const [ retCode, outA, errA ] = await getCmdDataP('apt', ['update'], { capture:/https?:\/\/[^ ]+/ }); // get only the apt URL's
```

```js
const [ retCode, outA, errA ] = await getCmdDataP('apt', ['update'], { filterOnly:'Hit', filterNot:'debian.org/' }); // Only get the lines containing Hit, but not the debian.org related lines.
```

```js
const [ retCode, outA, errA ] = await getCmdDataP('apt', ['update'], { filterOnly:/(E|Err):/ }); // get only the apt URL's
```

```js
const [ retCode, outA, errA ] = await getCmdDataP('df', ['-h'], { filterOnly:/(^Filesystem | \/$)/ }); // Get the headings and only the root filesystem's stats
```

```js
const [ retCode, outA, errA ] = await getCmdDataP('zfs', ['list','yourmom'], { filterNot:/^NAME / });
```

Ping foo-pc with an interval of 0.5 seconds, timeout of 2 sec per ping, max 5 attempts, stop immediately when you get a reply, capture/return the milliseconds.

```js
    const [ retCode, outA, errA ] = await getCmdDataP('ping', ['-i', '0.5', '-W', '2', '-c', '5', 'foo-pc'], { capture:/bytes from.+time=([\d.]+)/, until:'bytes from' });
```

## API

### `getCmdDataP(cmd, argsA=[], optionsO={})`

- **cmd**: _String_ – Command to run.
- **argsA**: _Array&lt;string&gt;_ – Command arguments.
- **optionsO**: _Object_
  - **passthru**: _Boolean_ (default: true) – Print stdout/stderr to terminal live.
  - **filterOnly**: _Function/RegExp/String_ – Include only lines matching this.
  - **filterNot**:  _Function/RegExp/String_ – Exclude lines matching this.
  - **capture**:    _Function/RegExp_        – Map/transforms each line before collecting.
  - **until**:      _Function/RegExp/String_ – Stop (kill process) once a match is seen:  
    - Function: receives all new output lines, stop if returns truthy  
    - String: stop if any new line includes it  
    - RegExp: stop if any new line matches  
  - **verbosity**:  _0-3_ (default:3) – Control log output:
    - 0:silent, 1:errors, 2:show commands, 3:show success
  - **env**:        _Object_ – Extra environment variables (merged with `process.env`).
  - **spawnO**:     _Object_ – Additional options for [`child_process.spawn`](https://nodejs.org/api/child_process.html#child_processspawncommand-args-options).
  - **rejectOnError**: _Boolean_ (default:true) – Rejects promise on error/exit code != 0. If false, always resolves.

#### Capture groups in `capture` regex
* If you have no capture groups, you get the whole match.
* If you have 1 capture group, you get what you captured.
* If you have 2+ capture groups, you get an array of your captures

Your capture groups should (_not_)? be optional. If you make them optional you will have to deal with a varying output format caused by your 🐂💩 regex.

#### Returns

A Promise resolving to:

```js
[ exitCode, outA, errA ]
```

- _exitCode_: 0 on success; else reject with code > 0
- _outA_: Array of (possibly filtered/transformed) stdout lines
- _errA_: Array of (possibly filtered/transformed) stderr lines

## Features

- **No dependencies**: Simple, fast, no bloat.
- **Small**: Only 6k of code
- **Stable API**: No breaking changes will ever be made.
- **Passthrough**: See output live by default, or disable for silent/asynchronous capture.
- **Filtering/Mapping**: Pick or modify output lines with strings, RegExp, or functions.
- **Great for automation**: User can watch progress, calling script gets all of the data output.
- **No noise**: Get only the data that you need
- **Flexible Environment**: Pass custom env variables, cwd, etc.
- **Powerful**: Get shit done!

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
