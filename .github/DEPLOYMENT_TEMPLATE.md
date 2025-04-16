---
title: Deployment to {{ env.DEPLOY_ENV }} - {{ env.DEPLOY_VERSION }}
labels: deployment
assignees: ''
---

# 🚀 Deployment to {{ env.DEPLOY_ENV }}

A new deployment has been completed to the **{{ env.DEPLOY_ENV }}** environment.

## 📋 Deployment Details

- **Environment:** {{ env.DEPLOY_ENV }}
- **Deployment URL:** {{ env.DEPLOY_URL }}
- **Version:** {{ env.DEPLOY_VERSION }}
- **Deployed at:** {{ env.DEPLOY_TIME }}
- **Workflow Run:** [{{ github.workflow }} #{{ github.run_number }}]({{ github.server_url }}/{{ github.repository }}/actions/runs/{{ github.run_id }})

## 📝 Deployment Notes

{{ env.DEPLOY_NOTES }}

## 🔍 Validation Steps

- [ ] Verify that the application loads correctly
- [ ] Check that all main functionality is working
- [ ] Ensure there are no visual regressions
- [ ] Confirm API connections are working properly
- [ ] Validate any changes to environment-specific configurations

## 📌 Related Issues

<!-- The following section will automatically link issues mentioned in the deployment notes -->

<!-- Mention any associated PRs here with the #PR_NUMBER syntax -->

## 🔄 Rollback Information

If rollback is needed, use the GitHub Pages deployment settings in the repository or run:

```bash
# Redeploy previous successful version
gh workflow run github-pages-deploy.yml -f environment=production
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