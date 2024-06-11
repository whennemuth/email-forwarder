#!/usr/bin/env node
import 'source-map-support/register';
import { App, CfnOutput, StackProps, Tags } from 'aws-cdk-lib';
import { EmailForwarderStack } from '../lib/email-forwarder-stack';
import { IContext } from '../contexts/IContext';
import * as ctx from '../contexts/context.json';

const context:IContext = <IContext>ctx;
const { ACCOUNT:account, REGION:region, STACK_ID, TAGS: { Function, Landscape, Service } } = context;

const app = new App();
app.node.setContext('stack-parms', context);
const stackName = `${STACK_ID}-${Landscape}`;

const stackProps: StackProps = {
  stackName,
  description: 'Email/SMTP forwarder - Performs a many-to-one rerouting operation for any of a series of pseudo email addresses to one real email address. Inteneded to aid developers and QA testers.',
  env: { account, region },
  tags: { Service, Function, Landscape }
}

const stack:EmailForwarderStack = new EmailForwarderStack(app, stackName, stackProps);

// Adding tags into the stackProps does not seem to work - have to apply tags using aspects:
Tags.of(stack).add('Service', Service);
Tags.of(stack).add('Function', Function);
Tags.of(stack).add('Landscape', Landscape);