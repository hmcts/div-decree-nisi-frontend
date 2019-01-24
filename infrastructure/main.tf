provider "azurerm" {
  version = "1.19.0"
}

locals {
  aseName = "${data.terraform_remote_state.core_apps_compute.ase_name[0]}"
  public_hostname = "${var.product}-${var.component}-${var.env}.service.${local.aseName}.internal"
  local_env = "${(var.env == "preview" || var.env == "spreview") ? (var.env == "preview" ) ? "aat" : "saat" : var.env}"

  previewVaultName = "${var.raw_product}-aat"
  nonPreviewVaultName = "${var.raw_product}-${var.env}"
  vaultName = "${(var.env == "preview" || var.env == "spreview") ? local.previewVaultName : local.nonPreviewVaultName}"
  evidence_management_client_api_url = "http://div-emca-${local.local_env}.service.core-compute-${local.local_env}.internal"

  case_orchestration_service_api_url = "http://div-cos-${local.local_env}.service.core-compute-${local.local_env}.internal"
  case_maintence_service_api_url = "http://div-cms-${local.local_env}.service.core-compute-${local.local_env}.internal"
  fees_payment_service_api_url = "http://div-fps-${local.local_env}.service.core-compute-${local.local_env}.internal"

  health_endpoint = "/health"

  asp_name = "${var.env == "prod" ? "div-dn-prod" : "${var.raw_product}-${var.env}"}"
  asp_rg = "${var.env == "prod" ? "div-dn-prod" : "${var.raw_product}-${var.env}"}"

  appinsights_name           = "${var.env == "preview" ? "${var.product}-${var.reform_service_name}-appinsights-${var.env}" : "${var.product}-${var.env}"}"
  appinsights_resource_group = "${var.env == "preview" ? "${var.product}-${var.reform_service_name}-${var.env}" : "${var.product}-${var.env}"}"
}

module "redis-cache" {
  source   = "git@github.com:contino/moj-module-redis?ref=master"
  product  = "${var.env != "preview" ? "${var.product}-redis" : "${var.product}-${var.reform_service_name}-redis"}"
  location = "${var.location}"
  env      = "${var.env}"
  subnetid = "${data.terraform_remote_state.core_apps_infrastructure.subnet_ids[1]}"
  common_tags = "${var.common_tags}"
}

module "frontend" {
  source                          = "git@github.com:hmcts/moj-module-webapp.git?ref=master"
  product                         = "${var.product}-${var.reform_service_name}"
  location                        = "${var.location}"
  env                             = "${var.env}"
  ilbIp                           = "${var.ilbIp}"
  is_frontend                     = "${var.env != "preview" ? 1: 0}"
  subscription                    = "${var.subscription}"
  additional_host_name            = "${var.env != "preview" ? var.additional_host_name : "null"}"
  https_only                      = "false"
  capacity                        = "${var.capacity}"
  common_tags                     = "${var.common_tags}"
  asp_name                        = "${local.asp_name}"
  asp_rg                          = "${local.asp_rg}"
  instance_size                   = "I3"
  appinsights_instrumentation_key = "${var.appinsights_instrumentation_key}"

  app_settings = {

    // Node specific vars
    NODE_ENV = "${var.node_env}"
    NODE_PATH = "${var.node_path}"

    BASE_URL = "${var.public_protocol}://${local.public_hostname}"

    UV_THREADPOOL_SIZE = "${var.uv_threadpool_size}"
    NODE_CONFIG_DIR = "${var.node_config_dir}"

    // Logging vars
    REFORM_TEAM = "${var.reform_team}"
    REFORM_SERVICE_NAME = "${var.reform_service_name}"
    REFORM_ENVIRONMENT = "${var.env}"
    DEPLOYMENT_ENV="${var.deployment_env}"

    // Packages
    PACKAGES_NAME="${var.packages_name}"
    PACKAGES_PROJECT="${var.packages_project}"
    PACKAGES_ENVIRONMENT="${var.packages_environment}"
    PACKAGES_VERSION="${var.packages_version}"

    // Service name
    SERVICE_NAME="${var.frontend_service_name}"

    // IDAM
    IDAM_API_URL = "${var.idam_api_url}"
    IDAM_APP_HEALHCHECK_URL ="${var.idam_api_url}${var.health_endpoint}"
    IDAM_LOGIN_URL = "${var.idam_authentication_web_url}${var.idam_authentication_login_endpoint}"
    IDAM_AUTHENTICATION_HEALHCHECK_URL = "${var.idam_authentication_web_url}${var.health_endpoint}"
    IDAM_SECRET = "${data.azurerm_key_vault_secret.idam_secret.value}"

    // Redis Cloud
    REDISCLOUD_URL = "redis://ignore:${urlencode(module.redis-cache.access_key)}@${module.redis-cache.host_name}:${module.redis-cache.redis_port}?tls=true"
    REDIS_ENCRYPTION_SECRET = "${data.azurerm_key_vault_secret.redis_secret.value}"

    // Evidence Management Client API
    EVIDENCE_MANAGEMENT_CLIENT_API_URL             = "${local.evidence_management_client_api_url}"
    EVIDENCE_MANAGEMENT_CLIENT_API_HEALTHCHECK_URL = "${local.evidence_management_client_api_url}${local.health_endpoint}"
    EVIDENCE_MANAGEMENT_CLIENT_API_UPLOAD_ENDPOINT = "${var.evidence_management_client_api_upload_endpoint}"

    // CCase Orchestration API
    ORCHESTRATION_SERVICE_URL              = "${local.case_orchestration_service_api_url}"
    ORCHESTRATION_SERVICE_GET_PETITION_URL = "${local.case_orchestration_service_api_url}/retrieve-case"
    ORCHESTRATION_SERVICE_POST_PETITION_URL= "${local.case_orchestration_service_api_url}/submit-dn"
    ORCHESTRATION_SERVICE_HEALTH_URL       = "${local.case_orchestration_service_api_url}${local.health_endpoint}"
    ORCHESTRATION_SERVICE_DRAFT_ENDPOINT   = "${var.case_orchestration_service_draft_endpoint}"

    //Case Maintenance
    CASE_MAINTENANCE_BASE_URL              = "${local.case_maintence_service_api_url}"

    //Fees and Payments
    FEES_AND_PAYMENTS_URL = "${local.fees_payment_service_api_url}"
    FEES_AND_PAYMENTS_HEALTHCHECK_URL = "${local.fees_payment_service_api_url}${local.health_endpoint}"

    // Feature toggling through config
    FEATURES_IDAM                           = "${var.feature_idam}"
    FEATURE_RELEASE_520                     = "${var.feature_release_520}"

    // Encryption secrets
    SESSION_SECRET = "${data.azurerm_key_vault_secret.session_secret.value}"

    // Google Anayltics
    GOOGLE_ANALYTICS_ID           = "${var.google_analytics_tracking_id}"
    GOOGLE_ANALYTICS_TRACKING_URL = "${var.google_analytics_tracking_url}"

    // HPKP
    HPKP_MAX_AGE = "${var.hpkp_max_age}"
    HPKP_SHAS = "${var.hpkp_shas}"

    // Rate Limiter
    RATE_LIMITER_TOTAL  = "${var.rate_limiter_total}"
    RATE_LIMITER_EXPIRE = "${var.rate_limiter_expire}"
    RATE_LIMITER_ENABLED = "${var.rate_limiter_enabled}"

    // Petitioner Front End
    PETITIONER_FRONTEND_URL = "${var.petitioner_frontend_url}"

    // Respondent Front End
    RESPONDENT_FRONTEND_URL = "${var.respondent_frontend_url}"

    // CCD Filters
    CCD_DIGITAL_COURTS = "${var.ccd_digital_courts}"

    WEBSITE_LOCAL_CACHE_OPTION = "Never"
    WEBSITE_LOCAL_CACHE_SIZEINMB = 0
    WEBSITE_DYNAMIC_CACHE = 0
  }
}

data "azurerm_key_vault" "div_key_vault" {
  name                = "${local.vaultName}"
  resource_group_name = "${local.vaultName}"
}

data "azurerm_key_vault_secret" "idam_secret" {
  name = "idam-secret"
  vault_uri = "${data.azurerm_key_vault.div_key_vault.vault_uri}"
}

data "azurerm_key_vault_secret" "session_secret" {
  name = "session-secret"
  vault_uri = "${data.azurerm_key_vault.div_key_vault.vault_uri}"
}

data "azurerm_key_vault_secret" "redis_secret" {
  name      = "redis-secret"
  vault_uri = "${data.azurerm_key_vault.div_key_vault.vault_uri}"
}
