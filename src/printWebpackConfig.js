import { writeFileSync } from 'fs';
import stringify from 'stringify-object';

const writeConfigFile = (output, final) => {
  final = stringify(final, {indent: ' '});
  final = `module.exports = ${final}`;
  writeFileSync(output, final);
}

export default writeConfigFile;
