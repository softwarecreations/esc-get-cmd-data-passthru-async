export interface GetCmdDataOptions {                                 // Options for getCmdDataP command execution/filtering
  passthru?: boolean;                                                // Passthrough stdout/stderr to parent process's stdout/stderr
  filterOnly?: ((line: string) => boolean) | RegExp | string | null; // Only include lines that match this filter (function/regex/string/null)
  filterNot?: ((line: string) => boolean) | RegExp | string | null;  // Exclude lines that match this filter (function/regex/string/null)
  capture?: ((line: string) => string) | RegExp | null;              // Map/transform lines before collecting (function/regex/null)
  until?: ((lines: string[]) => boolean) | RegExp | string | null;   // Kill/stop when this matches until(linesA) is truthy for stdout/stderr or any line matches until regex/string
  verbosity?: number;                                                // Control log output (0-3: silent/errors/commands/success)
  env?: { [key: string]: string | undefined };                       // Additional environment variables
  rejectOnError?: boolean;                                           // If true (default), promise rejects on nonzero exit code or error
  [key: string]: any;                                                // Any other spawn options
}

/**
 * Executes a shell command with advanced output filtering and capturing.
 *
 * @param cmd - Command to execute.
 * @param argsA - Command arguments.
 * @param optionsO - Additional execution/filtering options.
 * @returns Promise that resolves with [exitCode, stdoutLines, stderrLines], or rejects similarly (unless rejectOnError is false).
 */
export function getCmdDataP(
  cmd: string,
  argsA?: string[],
  optionsO?: GetCmdDataOptions
): Promise<[number, string[], string[]]>;
