export async function sendEmail(emailIds, subject, body) {
  const SES = new AWS.SES({ apiVersion: "2010-12-01" });
  let emails = emailIds.split(",");
  //emails.push(email_id);
  const params = {
    Destination: {
      ToAddresses: emails,
    },
    Message: {
      Body: {
        Text: {
          Data: body,
        },
      },
      Subject: {
        Data: subject,
      },
    },
    Source: process.env.REACT_APP_AWS_SES_EMAIL_ID,
  };

  try {
    const data = await SES.sendEmail(params).promise();

    return "success";
  } catch (err) {
    return "error";
  }
}
