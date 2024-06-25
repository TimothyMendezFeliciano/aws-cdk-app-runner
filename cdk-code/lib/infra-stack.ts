import * as cdk from '@aws-cdk/core';
import apprunner = require('@aws-cdk/aws-apprunner'); // Allows working with App Runner resources
import assets = require('@aws-cdk/aws-ecr-assets'); // Allows building the docker image and uploading to ECR
import * as path from "path"; // Helper for working with file paths

export class InfraStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const imageAsset = new assets.DockerImageAsset(this, 'ImageAssets', {
      directory: path.join(__dirname, '../../SampleApp/'),
    });

    const service = new apprunner.Service(this, 'Service', {
      source: apprunner.Source.fromAsset({
        imageConfiguration: { port: 80 },
        asset: imageAsset
      })
    });

    new cdk.CfnOutput(this, "apprunner-url", {
      exportName: "apprunner-url",
      value: service.serviceUrl,
      description: "URL to access service"
    });
  }
}
