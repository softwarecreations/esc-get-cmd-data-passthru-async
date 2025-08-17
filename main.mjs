#!/usr/bin/env node
'use strict';

const fooP = async () => {

};

export default fooP;

// delete the shebang if not cli script
// if it can be CLI or a module, make a (non "main":) executable file with a shebang that imports fooP and uses it with process.argv (see esc-get-project-linecounts)
