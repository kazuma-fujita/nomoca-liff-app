/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = function (event, context, callback) {
  if (event.triggerSource === "PreSignUp_SignUp") {
    event.response.autoConfirmUser = true;
  }
  callback(null, event);
};
