import { spawn } from 'child_process';

/**
 * Executes a command as a child process and processes its stdout/stderr output with optional filtering.
 * 
 * @param {string}                  cmd                          - The command to run.
 * @param {Array<string>}           argsA                        - Array of arguments to pass to the command.
 * @param {Object}                  optionsO                     - Options for command execution and output filtering.
 * @param {boolean}                [optionsO.passthru=true]      - If true, passthrough stdout/stderr to parent.
 * @param {Function|RegExp|string} [optionsO.filterOnly=Boolean] - Only include lines matching this filter function/regex/string
 * @param {         RegExp|string} [optionsO.filterNot =null   ] -      Exclude lines matching this filter          regex/string
 * @param {Function|RegExp|null}   [optionsO.capture   =null   ] - Map lines with this function / regex
 * @param {number}                 [optionsO.verbosity=3]        - Verbosity: 0=silent, 1=errors, 2=commands, 3=success.
 * @param {Object}                 [optionsO.env={}]             - Environment variables to add/override.
 * @param {Object}                 [optionsO.spawnO]             - Additional options for child_process.spawn.
 * @param {boolean}                [optionsO.rejectOnError=true] - If true (default), promise rejects on nonzero exit/error. If false, always resolves. 
 * 
 * @returns {Promise<[number, Array<string>, Array<string>]>} - Resolves with [exitCode, stdoutLines, stderrLines],
 *   rejects with [exitCode, stdoutLines, stderrLines] on error.
 */

export const getCmdDataP = ( cmd, argsA=[], optionsO={} ) => {
  const { passthru=true, filterOnly=Boolean, filterNot=null, capture=null, verbosity=3, env={}, rejectOnError=true, ...spawnO } = optionsO;
  const envO = { ...process.env, ...env };
  const cmdStr = `${cmd} ${argsA.join(' ')}`;
  if (verbosity >= 2) console.log('Will run', env, cmdStr);

  return new Promise( (resolveF, rejectF) => {
    const errF = rejectOnError ? rejectF : resolveF;
    const child = spawn(cmd, argsA, { ...spawnO, env:envO });

    const outA = [], errA = [];

    const getLinesA = data => {
      let linesA = data.toString().split(/\r?\n/);
      if (     typeof capture==='function'        ) linesA = linesA.map( capture );
      else if (       capture instanceof RegExp   ) linesA = linesA.map( line => {
        const matchA = line.match(capture);
        return matchA!==null ? matchA[0] : '';
      });
      if      (typeof filterOnly==='function'     ) linesA = linesA.filter( filterOnly );
      else if (typeof filterOnly==='string'       ) linesA = linesA.filter( line => line.includes(filterOnly) );
      else if (       filterOnly instanceof RegExp) linesA = linesA.filter( line => filterOnly.test(line) );
      if      (typeof filterNot==='string'        ) linesA = linesA.filter( line => !line.includes(filterNot) );
      else if (       filterNot instanceof RegExp ) linesA = linesA.filter( line => !filterNot.test(line) );
      return linesA;
    };

    child.stdout.on('data', data => {
      outA.push( ...getLinesA(data) );
      if (passthru) process.stdout.write(data);
    });
    child.stderr.on('data', data => {
      errA.push( ...getLinesA(data) );
      if (passthru) process.stderr.write(data);
    });


    child.on('error', err => {
      if (verbosity >= 1) console.error(`Error running command: ${cmdStr}`);
      errF( [ 1, outA, errA.length ? errA : [err?.message || 'Unknown error'] ] );
    });

    child.on('close', code => {
      if (outA.length!==0 && outA[outA.length - 1].length===0) outA.pop(); // remove empty last line
      if (errA.length!==0 && errA[errA.length - 1].length===0) errA.pop(); // remove empty last line
      if (code === 0) {
        if (verbosity >= 3) console.log(`The command succeeded: ${cmdStr}`);
        resolveF( [ 0, outA, errA ] );
      } else {
        if (verbosity >= 1) console.error(`The command failed (code ${code}): ${cmdStr}`);
        errF( [ code ?? 1, outA, errA ] );
      }
    });
  });
};
