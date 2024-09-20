import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { EmailForwardingRuleSet} from '@seeebiii/ses-email-forwarding';
import { IContext } from '../contexts/IContext';
import { CfnParameter } from 'aws-cdk-lib/aws-ssm';

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

    // Instantiate the ruleset construct
    const ruleset = new EmailForwardingRuleSet(this, 'EmailForwardingRuleSet', {
      enableRuleSet: true,
      emailForwardingProps: [{
        domainName, verifyDomain, fromPrefix, emailMappings
      }]
    });

    // Use an escape hatch to change the tier of the ssm parameter if its value is getting too big.
    const cfnParameter = ruleset.node.findChild('EmailForwardingRule-0').node.findChild('ForwardEmailMapping').node.defaultChild as CfnParameter;
    if(cfnParameter.value.length > 4096) {
      console.log('SSM Parameter value exceeds the 4096 character limit for standard tier - promoting to advanced tier');
      cfnParameter.addPropertyOverride('Tier', 'Advanced');
    }
  }
}
