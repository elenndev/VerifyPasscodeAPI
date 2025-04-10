# 🔐 VerifyPasscode API
This project provides a simple two-endpoint API for handling user passcode verification, built with Node.js, Express, MongoDB and Nodemailer.
# 📌 Endpoint responses
## /validate-code/generate-code
  ```js
    // sucess (status 200)
    {
      "message": "validation code created",
      "codeGeneration": 200
    }
    // undefined values on the body request (status 400)
      {
        "error": "Values not found"
      }
  ```

## /validate-code/check-code
```js
    // passcode verified successfully. (status 200)
    {
      "message": "code validated successfully",
      "checkCode": true
    }
    // Incorrect passcode (status 200)
    {
      "message": "invalid code",
      "checkCode": false
    }
    // expired passcode (status 400)
      {
        "error": "expired code"
      }
    // user not found (status 400)
      {
        "error": "Pending validation not found for this user"
      }
  ```
