# Email/SMTP Forwarder

This CDK application is intended for use by developers and QA testers.

One of the challenges for one person to test an application that includes emailing services while taking the role of multiple users is that they need a unique email address for each user. After a point it would become onerous to create multiple Gmail accounts for this purpose, and email testing services are either not free or free for a trial period.

This app builds a small convenience wrapper around constructs coming out of the [ses-email-forwarding](https://www.npmjs.com/package/@seeebiii/ses-email-forwarding) npm package *([github repo](https://github.com/seeebiii/ses-email-forwarding))*, to put in place an app that performs a many-to-one rerouting operation for any of a series of pseudo email addresses to one real email address.

## Configure:

To configure how the app is to reroute email addresses you must create a `./contexts/context.json` file:

```
{
  "STACK_ID": "ett-email-forwarder",
  "ACCOUNT": "037860335094",
  "REGION": "us-east-2",
  "DOMAIN_NAME": "mydomain.org",
  "VERIFY_DOMAIN": true,
  "FROM_PREFIX": "noreply",
  "EMAIL_MAPPINGS": [
    { "receivePrefix": "test1", "targetEmails": [ "qa_person123@gmail.com" ] },
    { "receivePrefix": "test2", "targetEmails": [ "qa_person123@gmail.com" ] },
    { "receivePrefix": "test3", "targetEmails": [ "qa_person123@gmail.com" ] }
  ],
  "TAGS": {
    "Service": "some-bu-service",
    "Function": "some-bu-function",
    "Landscape": "dev"
  }
}
```

- DOMAIN_NAME: Before you begin, you should own/control a domain *(like "mydomain.org")* that can delegate to a [Route53 hosted zone](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/hosted-zones-working-with.html) for DNS resolution. This will be the root upon which pseudo email addresses are based. It is assumed that this hosted zone has already been set up before deploying this CDK stack. Upon deployment, [MX records](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html#MXFormat) will automatically be appended to the [hosted zone](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/hosted-zones-working-with.html) for this domain.
- VERIFY_DOMAIN: If you don't want to verify your domain in SES or you are in the SES sandbox, you can still send emails to verified email addresses. Use the property `verifyTargetEmailAddresses` in this case and set it to `true`
- FROM_PREFIX: When emails are received they will be seen to come from `<FROM_PREFIX>@<DOMAIN_NAME>`, *(for example: `"noreply@mydomain.org"`)*
- EMAIL_MAPPINGS [
  - receivePrefix: The prefix matching the receiver address as `<receivePrefix>@<DOMAIN_NAME>`
  - targetEmails: An array of "real" email addresses, like "qa_person123@gmail.com" that will receive actual emails. If SES for your AWS account does not operate with production access, make sure these email addresses are verified accounts in the [SES sandbox](https://docs.aws.amazon.com/ses/latest/dg/request-production-access.html).
- ]

## Sample Use case:

A QA Tester wants to setup account creation in an application that has several roles.
The QA tester has test cases to go through the process of setting up a dozen different user accounts, part of which involves the standard practice of emailing a confirmation code out to a user that they must enter retrieve from the email inbox and enter into a text field on the app to complete their account creation. This means access to a dozen different email inboxes.
The QA tester also wants to be organized and have these emails reflect the role of the users as defined in their test cases: 

- admin
- sysadmin
- manager
- tech-support
- sales-rep

The QA tester needs to set up 5 sales reps, 3 tech-support reps, 2 managers, 1 admin, and 1 sysadmin.
The QA tester wants to see the confirmation code emails for all of these users routed to their own single private Gmail account "joe.tester@gmail.com".
The dev-ops engineer who accommodates these requirements would:

1. Ensure "joe.tester@gmail.com" is registered in the [SES sandbox](https://docs.aws.amazon.com/ses/latest/dg/request-production-access.html)

2. If de-ops engineer controls the domain "myschool.edu", a hosted zone is created for it.

3. Deploy this CDK app with the configuration to include the following settings:

   ```
     "DOMAIN_NAME": "myschool.edu",
     "FROM_PREFIX": "noreply",
     "EMAIL_MAPPINGS": [
       { "receivePrefix": "admin", "targetEmails": [ "joe.tester@gmail.com" ] },
       { "receivePrefix": "sysadmin", "targetEmails": [ "joe.tester@gmail.com" ] },
       { "receivePrefix": "manager1", "targetEmails": [ "joe.tester@gmail.com" ] },
       { "receivePrefix": "manager2", "targetEmails": [ "joe.tester@gmail.com" ] },
       { "receivePrefix": "tech-support1", "targetEmails": [ "joe.tester@gmail.com" ] },
       { "receivePrefix": "tech-support2", "targetEmails": [ "joe.tester@gmail.com" ] },
       { "receivePrefix": "tech-support3", "targetEmails": [ "joe.tester@gmail.com" ] },
       { "receivePrefix": "sales-rep1", "targetEmails": [ "joe.tester@gmail.com" ] },
       { "receivePrefix": "sales-rep2", "targetEmails": [ "joe.tester@gmail.com" ] },
       { "receivePrefix": "sales-rep3", "targetEmails": [ "joe.tester@gmail.com" ] },
       { "receivePrefix": "sales-rep4", "targetEmails": [ "joe.tester@gmail.com" ] },
       { "receivePrefix": "sales-rep5", "targetEmails": [ "joe.tester@gmail.com" ] }
     ],
   ```

When the QA tester is setting up the 3rd tech support account, for example, the would register that users email address in the app under test as:
`tech-support3@myschool.edu`
The confirmation code for this tech support applicant should come in an email that lands in the QA testers `joe.tester@gmail.com` inbox.

## Useful commands

* `npm run synth`    synthesize the yaml for the CDK stack - `./cdk.out/stack.yaml` is created.
* `npm run deploy`    deploy the app to your account
* `npm run redeploy`    tear down your existing app and rebuild it without any prompts
