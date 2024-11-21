import fs from 'fs';

function removeIds(obj) {
  if (obj && typeof obj === 'object') {
    Object.keys(obj).forEach(key => {
      if (key === 'id') {
        console.log('Delete _id:', obj[key])
        delete obj[key]
      } else {
        removeIds(obj[key])
      }
    });
  }
}

fs.readFile('./stay_without_id.json', 'utf8', (err, data) => {
  if (err) {
    console.error('err with reading file:', err)
    return
  }

  let jsonData = JSON.parse(data);

  jsonData.forEach(item => removeIds(item));

  fs.writeFile('stay_without_id.json', JSON.stringify(jsonData, null, 2), (err) => {
    if (err) {
      console.error('err with writing file:', err);
    } else {
      console.log('success!');
    }
  });
});
