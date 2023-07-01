const fs = require('fs');
const path = require('path');
//console.log(__dirname);

const imageFileNames = () => {
  const array = fs
    .readdirSync('../src/assets/images/')
    .filter(file => {
      return file.endsWith('.png');
    })
    .map(file => {
      return file.replace('@2x.png', '').replace('@3x.png', '');
    });
  return Array.from(new Set(array));
};
const generate = () => {
  let properties = imageFileNames()
    .map(name => {
      return `${name}: require('./images/${name}.png')`;
    })
    .join(',\n  ');
  const string = `const images = {
  ${properties}
}
export { images }
`;
  fs.writeFileSync('../src/assets/index.js', string, 'utf8');
};
generate();
