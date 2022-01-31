// Infrastructural variables

variable "reform_team" {
  default = "div"
}

variable "product" {}

variable "raw_product" {
  default = "div"
}

variable "location" {
  default = "UK South"
}

variable "env" { }

variable "deployment_env" {}

variable "deployment_path" {
  default = "/opt/divorce/frontend"
}

variable "subscription" { }

variable "vault_section" {}

// CNP settings
variable "jenkins_AAD_objectId" {
  description                 = "(Required) The Azure AD object ID of a user, service principal or security group in the Azure Active Directory tenant for the vault. The object ID must be unique for the list of access policies."
}

variable "tenant_id" {
  description = "(Required) The Azure Active Directory tenant ID that should be used for authenticating requests to the key vault. This is usually sourced from environemnt variables and not normally required to be specified."
}

variable "uv_threadpool_size" {
  default = "64"
}

variable "node_env" {
  default = "production"
}

variable "node_path" {
  default = "."
}

variable "additional_host_name" {}

// Package details

variable "packages_environment" {}

variable "packages_version" {
  default = "-1"
}

variable "public_protocol" {
  default = "https"
}

variable "http_proxy" {
  default = "http://proxyout.reform.hmcts.net:8080/"
}

variable "no_proxy" {
  default = "localhost,127.0.0.0/8,127.0.0.1,127.0.0.1*,local.home,reform.hmcts.net,*.reform.hmcts.net,betaDevBdivorceAppLB.reform.hmcts.net,betaDevBccidamAppLB.reform.hmcts.net,*.internal,*.platform.hmcts.net"
}

variable "health_endpoint" {
  default = "/health"
}

variable "idam_authentication_web_url" {}

variable "petitioner_frontend_url" {}

variable "respondent_frontend_url" {}

variable "decree_absolute_frontend_url" {
  default = ""
}

variable "idam_authentication_login_endpoint" {
  default = "/login"
}

variable "idam_api_url" {}

variable "frontend_service_name" {
  default = "divorce-decree-nisi-frontend"
}

variable "s2s_microservice_name" {
  default = "divorce_frontend"
}

variable "hpkp_max_age" {
  default = "86400"
}

variable "hpkp_shas" {
  default = "Naw+prhcXSIkbtYJ0t7vAD+Fc92DWL9UZevVfWBvids=,klO23nT2ehFDXCfx3eHTDRESMz3asj1muO+4aIdjiuY=,grX4Ta9HpZx6tSHkmCrvpApTQGo67CYDnvprLg5yRME="
}

variable "component" {}

variable "capacity" {
  default = "1"
}

variable "google_analytics_tracking_id" {}

variable "google_analytics_tracking_url" {
  default = "http://www.google-analytics.com/collect"
}

variable "rate_limiter_total" {
  default = "3600"
}

variable "rate_limiter_expire" {
  default = "3600000"
}

variable "rate_limiter_enabled" {
  default = false
}

variable "common_tags" {
  type = map(string)
}

variable "evidence_management_client_api_upload_endpoint" {
  default = "/emclientapi/version/1/upload"
}

variable "evidence_management_download_endpoint" {
  default = "/emclientapi/version/1/download"
}

variable "case_orchestration_service_draft_endpoint" {
  default = "/draftsapi/version/1"
}

variable "feature_idam" {
  default = true
}

variable "feature_awaiting_clarification" {
  default = true
}

variable "feature_dn_is_refused" {
  default = true
}

variable "ccd_digital_courts" {
  default = "[\"serviceCentre\"]"
}

variable "appinsights_instrumentation_key" {
  description = "Instrumentation key of the App Insights instance this webapp should use. Module will create own App Insights resource if this is not provided"
  default     = ""
}

variable "node_version" {
  default = "12.14.1"
}

variable "enable_ase" {
  default = false
}
