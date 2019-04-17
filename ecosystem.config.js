module.exports = {
	apps: [{
		name: "app",
		script: "./app/index.ts",
		watch: ["./app", "./local_modules"],
		instances: 1,
		exec_mode: "cluster_mode",
		log_date_format: "YYYY-MM-DD HH:mm Z",
		merge_logs: true,
		error_file: "./log/error.log",
		out_file: "./log/access.log",
		node_args: ["--inspect=0.0.0.0:9229", "--no-warnings"],
		env: {
			"NODE_OPTIONS": "--inspect=localhost:9229"
		}
	}]
}