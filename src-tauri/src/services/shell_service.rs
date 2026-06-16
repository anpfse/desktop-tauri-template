//! Shell 命令执行服务

use crate::error::AppResult;
use crate::models::CommandOutput;
use std::process::Command;

const ALLOWED_PROGRAMS: &[&str] = &["cargo", "git", "node", "pnpm"];

pub fn run(program: &str, args: &[String]) -> AppResult<CommandOutput> {
    validate_program(program)?;

    let output = Command::new(program).args(args).output()?;

    Ok(CommandOutput {
        code: output.status.code().unwrap_or(-1),
        stdout: String::from_utf8_lossy(&output.stdout).into_owned(),
        stderr: String::from_utf8_lossy(&output.stderr).into_owned(),
    })
}

fn validate_program(program: &str) -> AppResult<()> {
    if program.is_empty()
        || program.contains('/')
        || program.contains('\\')
        || !ALLOWED_PROGRAMS.contains(&program)
    {
        return Err(crate::error::AppError::Command(format!(
            "Program not allowed: {program}"
        )));
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::validate_program;

    #[test]
    fn allows_known_developer_tools() {
        assert!(validate_program("git").is_ok());
        assert!(validate_program("pnpm").is_ok());
    }

    #[test]
    fn rejects_paths_and_unknown_programs() {
        assert!(validate_program("/bin/sh").is_err());
        assert!(validate_program("../tool").is_err());
        assert!(validate_program("python").is_err());
    }
}
