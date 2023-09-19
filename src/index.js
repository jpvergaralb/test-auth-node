const express = require('express');
const app = express();
const { auth } = require('express-oauth2-jwt-bearer');
const cors = require('cors');
const axios = require('axios');

const port = process.env.PORT || 8080;

const jwtCheck = auth({
  audience: 'http://localhost:3000/api/v1',
  issuerBaseURL: 'https://dev-ey2bs2vl3ozc1mwb.us.auth0.com/',
  tokenSigningAlg: 'RS256'
});

app.use(cors());

// enforce on all endpoints
app.use(jwtCheck);

app.get('/authorized', async function (req, res) {
  try {
    const authInfo = req.auth
    const { token } = authInfo

    const userInfo = await axios.get('https://dev-ey2bs2vl3ozc1mwb.us.auth0.com/userinfo', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(authInfo)
    res.status(200).json({response: 'authorized', userData: userInfo.data});

  } catch (error) {
    console.log(error)
    res.status(500).json({error: error.message});
  }
});


app.listen(port);

console.log('Running on port ', port);