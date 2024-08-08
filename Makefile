
# 必须要 --skip-local-validator ，才能使用另一个终端开启的 solana-test-validator
test:
	anchor test --skip-local-validator

keys:
	anchor keys list

# 删除部署的文件后，还得重启solana-test-validator
clean:
	anchor clean