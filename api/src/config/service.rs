#[derive(Debug, Clone)]
pub enum Stage {
  Development,
  Staging,
  Production,
}

impl Stage {
  pub fn as_str(&self) -> &'static str {
    match self {
      Self::Development => "development",
      Self::Staging => "staging",
      Self::Production => "production",
    }
  }
}

pub struct Config {
  pub stage: Stage,
  pub admin_auth_code: String,
  pub search_url: String,
  pub email_service_auth_token: String,
  pub kv_db_dir: String,
  pub ai_service_auth_token: String,
  pub jwt_secret: String,
  pub html_path: String,
  pub sqlite_base_url: String,
}

pub struct ConfigService {}

impl ConfigService {
  pub fn new() -> Self {
    Self {}
  }

  // @TODO-ZM: memoize get_config
  pub fn get_config(&self) -> Config {
    // Load the .env file
    dotenv::dotenv().ok();

    let stage = match std::env::var("STAGE")
      .expect("STAGE env variable is missing!")
      .as_str()
    {
      "development" => Stage::Development,
      "staging" => Stage::Staging,
      "production" => Stage::Production,
      _ => Stage::Development,
    };

    Config {
      stage: stage.clone(),
      admin_auth_code: std::env::var("ADMIN_AUTH_CODE")
        .expect("ADMIN_AUTH_CODE env variable is missing!"),
      search_url: "http://127.0.0.1:7280".to_string(),
      kv_db_dir: match stage {
        Stage::Development => "./kv_db_data",
        _ => "~/dzjob/kv_db",
      }
      .to_string(),
      email_service_auth_token: std::env::var("EMAIL_SERVICE_AUTH_TOKEN")
        .expect("EMAIL_SERVICE_AUTH_TOKEN env variable is missing!"),
      ai_service_auth_token: std::env::var("AI_SERVICE_AUTH_TOKEN")
        .expect("AI_SERVICE_AUTH_TOKEN env variable is missing!"),
      jwt_secret: std::env::var("JWT_SECRET").expect("JWT_SECRET env variable is missing!"),
      html_path: std::env::var("HTML_PATH").expect("HTML_PATH env variable is missing!"),
      sqlite_base_url: std::env::var("SQLITE_BASE_URL")
        .expect("SQLITE_BASE_URL env variable is missing!"),
    }
  }
}
