const bodyParser = require("body-parser");
const express = require("express");
const app = express();
app.use(bodyParser.text());
app.listen(process.env.PORT);
const hookcord = require("hookcord");
const Hook = new hookcord.Hook();
//
Hook.login("758706320994992149", process.env.SECRET);

app.get("/", (request, response) => {
  response.redirect("https:/scratchaddons.com");
});
app.get("/wake_up", (request, response) => {
  if (
    request.header("Origin") === "https://scratchaddons.com" ||
    request.header("Origin").startsWith("http://localhost")
  ) {
      response.send('Alive')
  } else response.status(403).send("nope!");
});

app.post("/send", async (request, response) => {
  if (
    request.header("Origin") === "https://scratchaddons.com" ||
    request.header("Origin").startsWith("http://localhost")
  ) {
    const body = JSON.parse(request.body); //
    console.log(body);
    Hook.setPayload({
      embeds: [
        {
          title: "<:scratchaddons:757962176572162158>  New feedback!",
          fields: [
            {
              name: "Scratch Addons version",
              value: body.version || "Unknown",
              inline: true,
            },
            {
              name: "Language",
              value: body.language || "unknown",
              inline: true,
            },
            {
              name: "Username",
              value: body.username || "unknown",
              inline: true,
            },
            {
              name:
                "User agent" +
                (body.userAgent.includes("Chrome")
                  ? `  <:chrome:758455448751570984> ${
                      Number(
                        body.userAgent.substring(
                          body.userAgent.indexOf("Chrome/") + 7,
                          body.userAgent.indexOf("Chrome/") + 9
                        )
                      ) || ""
                    }`
                  : body.userAgent.includes("Firefox")
                  ? `  <:firefox:758455448688001065> ${
                      Number(
                        body.userAgent.substring(
                          body.userAgent.indexOf("Firefox/") + 8,
                          body.userAgent.indexOf("Firefox/") + 10
                        )
                      ) || ""
                    }`
                  : ""),
              value: body.userAgent,
            },
          ],
          description:
            "```" + body.content.replace(/```/g, "[3 backticks]") + "```",
          timestamp: new Date().toISOString(),
          color: 16743206,
        },
      ],
    });
    Hook.fire().catch((err) => console.log(err));
    response.header("Access-Control-Allow-Origin", request.header("Origin"));
    response.send("sent!");
  } else response.status(403).send("nope!");
});
