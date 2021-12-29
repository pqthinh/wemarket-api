const admin = require("./authFirebase");

async function onSendNotification(body) {
  const {
    token = "dUqiTokyRI29xGtkTGsHbl:APA91bGnEsO-PptsE-rqNOHnclqAqps_Q-2w-kNzKYUItZHtMbxX7jsH_OZwfEcRekaoPdbOPj6vwU4vCQ8ZZCHwwyhnStRz2MNIiXPGLPdkDg9TOz9ccUHafO24qoOFShE-iqt32hps",
    title,
    content,
  } = body;
  console.log(body);
  if (!token) return;
  const response = await admin.messaging().sendToDevice(
    token, // ['token_1', 'token_2', ...]
    {
      notification: body?.notification,
      data: { title: title, body: content },
    },
    {
      // Required for background/quit data-only messages on iOS
      contentAvailable: true,
      // Required for background/quit data-only messages on Android
      priority: "high",
    }
  );
  console.log(response.results, "push ");
}

module.exports = onSendNotification;
