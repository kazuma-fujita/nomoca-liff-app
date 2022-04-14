/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = function (event, context) {
  if (event.triggerSource === "PreSignUp_SignUp") {
    event.response.autoConfirmUser = true;
  }
  return event;
};
