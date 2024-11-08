
local-test:
	npm run local-test

# 编译
build:
	anchor build

# 部署生成 bpf,以.so为后缀的可在区块链上执行的bpf字节程序
deploy:
	anchor deploy

# 必须要 --skip-local-validator ，才能使用另一个终端开启的 solana-test-validator
test:
	anchor test --skip-local-validator --skip-deploy

keys:
	anchor keys list
sync-keys:
	anchor keys sync

# 删除部署的文件后，还得重启solana-test-validator
clean:
	anchor clean

# 展开代码
expand:
	cargo expand --package p2 > expand_code/p2.rs
#	cargo expand --features "idl-build" -p p2 > expand_code/p2.rs

#最后一个参数是文件名，省略.rs后缀
expand_test_file:
	cargo expand --test test > czzexpandtest.rs


# 开启本地validator, 关掉vpn，不然会导致连接rpc服务失败
start-local-test-validator:
	solana-test-validator -u localhost
	#solana-test-validator -r

