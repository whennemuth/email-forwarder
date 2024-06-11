import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { EmailForwardingRuleSet} from '@seeebiii/ses-email-forwarding';
import { IContext } from '../contexts/IContext';

export class EmailForwarderStack extends Stack {
  constructor(scope: Construct, constructId: string, stackProps?: StackProps) {
    super(scope, constructId, stackProps);

    const context:IContext = scope.node.getContext('stack-parms');
    const { DOMAIN_NAME:domainName, FROM_PREFIX:fromPrefix, VERIFY_DOMAIN:verifyDomain=false, EMAIL_MAPPINGS:emailMappings, STACK_ID, TAGS } = context;

    // Set the tags for the stack
    var tags: object = TAGS;
    for (const [key, value] of Object.entries(tags)) {
      this.tags.setTag(key, value);
    }

    new EmailForwardingRuleSet(this, 'EmailForwardingRuleSet', {
      enableRuleSet: true,
      emailForwardingProps: [{
        domainName, verifyDomain, fromPrefix, emailMappings
      }]
    });
  }
}
