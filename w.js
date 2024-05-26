const express = require('express'); const app = express();
app.get('/', async function (req, res) {
  res.send('ping')
});
app.listen(process.env.PORT, () => console.log('3000 up!')) ;(async() => {
})()
