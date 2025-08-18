export interface GetCmdDataOptions {
  passthru?: boolean;
  filterOnly?: ((line: string) => boolean) | RegExp | string | null;
  filterNot?: ((line: string) => boolean) | RegExp | string | null;
  capture?: ((line: string) => string) | RegExp | null;
  verbosity?: number;
  env?: { [key: string]: string | undefined };
  rejectOnError?: boolean;
  [key: string]: any;
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
