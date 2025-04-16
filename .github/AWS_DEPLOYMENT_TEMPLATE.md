---
title: AWS Deployment to {{ env.DEPLOY_ENV }} - {{ env.DEPLOY_TYPE }}
labels: deployment, aws
assignees: ''
---

# 🚀 AWS Deployment to {{ env.DEPLOY_ENV }}

A new deployment has been completed to the **{{ env.DEPLOY_ENV }}** environment on AWS.

## 📋 Deployment Details

- **Environment:** {{ env.DEPLOY_ENV }}
- **Deployment Type:** {{ env.DEPLOY_TYPE }}
- **Frontend URL:** {{ env.FRONTEND_URL }}
- **API URL:** {{ env.API_URL }}
- **Version:** {{ env.DEPLOY_VERSION }}
- **Workflow Run:** [AWS Deploy #{{ github.run_number }}]({{ github.server_url }}/{{ github.repository }}/actions/runs/{{ github.run_id }})

## 📝 Deployment Notes

{{ env.DEPLOY_NOTES }}

## 🔧 Infrastructure Changes

{% if env.DEPLOY_TYPE == 'infrastructure-only' or env.DEPLOY_TYPE == 'full' %}
- CloudFormation stack deployed
- DynamoDB tables provisioned
- API Gateway endpoints configured
- IAM roles and policies set up
{% endif %}

## 🌐 Frontend Changes

{% if env.DEPLOY_TYPE == 'frontend-only' or env.DEPLOY_TYPE == 'full' %}
- Built and deployed to S3 bucket
- CloudFront distribution updated
- Cache invalidation performed
{% endif %}

## 🖥️ Backend Changes

{% if env.DEPLOY_TYPE == 'backend-only' or env.DEPLOY_TYPE == 'full' %}
- Lambda functions deployed via Serverless Framework
- API Gateway endpoints configured
- Backend environment variables updated
{% endif %}

## 🔍 Validation Steps

- [ ] Verify that CloudFront distribution is serving the frontend
- [ ] Check that API endpoints are responding correctly
- [ ] Test user authentication flow
- [ ] Validate database connections
- [ ] Check CloudWatch logs for any errors

## 📌 Related Issues

<!-- The following section will automatically link issues mentioned in the deployment notes -->

<!-- Mention any associated PRs here with the #PR_NUMBER syntax -->

## 🔄 Rollback Information

If rollback is needed, use one of the following methods:

**For frontend rollback:**
```bash
# Redeploy previous version
gh workflow run aws-deploy.yml -f environment=${{ env.DEPLOY_ENV }} -f deploy_type=frontend-only
```

**For backend rollback:**
```bash
# Roll back serverless deployment
cd backend && serverless rollback --stage ${{ env.DEPLOY_ENV }} --timestamp <TIMESTAMP>
```

**For infrastructure rollback:**
```bash
# Restore CloudFormation stack to previous state
aws cloudformation rollback-stack --stack-name uw-waste-management-${{ env.DEPLOY_ENV }}
```

---

<details>
<summary>Technical Deployment Information</summary>

- **Git SHA:** {{ github.sha }}
- **Workflow:** {{ github.workflow }}
- **Trigger:** {{ github.event_name }}
- **Branch:** {{ github.ref_name }}
- **Runner:** {{ runner.os }}

</details>