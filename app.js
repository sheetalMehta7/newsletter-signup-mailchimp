const bodyParser = require("body-parser");
const express = require("express");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://.api.mailchimp.com/3.0/lists/af1febd89c";

    const options = {
        method: "POST",
        auth: "authorName:apiKey"
    }

    const request = https.request(url, options, function (response) {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function (data) {
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);    //passing the data to mailchimp
    request.end();  //done with request

    app.post("/failure", function (req, res) {
        res.redirect("/");
    })


});

app.listen(process.env.PORT || 3000, () => {
    console.log("server is running on port 3000");
})

// List ID
// af1febd89c

// end point
// url = "https://.api.mailchimp.com/3.0/"
