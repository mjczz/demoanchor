
local-test:
	npm run local-test

# build specifiy the output directory for the IDL.
build:
	#anchor build -p memo_transfer  --idl $(shell pwd)/app/idl-types
	#anchor build -p memo_transfer --idl-ts $(shell pwd)/app/idl-types
	anchor build --idl-ts $(shell pwd)/app/idl-ts --idl $(shell pwd)/app/idl

build-target:
	anchor build

idl-build:
	# cd programs/enhanced_nft_program && ANCHOR_LOG=true anchor idl build
	 cd programs/memo-transfer && ANCHOR_LOG=true anchor idl build

# 部署生成 bpf,以.so为后缀的可在区块链上执行的bpf字节程序
deploy:
	anchor deploy

# 必须要 --skip-local-validator ，才能使用另一个终端开启的 solana-test-validator
test:
	anchor test --skip-local-validator --skip-deploy --skip-build --skip-lint

testm:
	#ANCHOR_PROVIDER_URL=http://127.0.0.1:8899 ANCHOR_WALLET=~/.config/solana/id.json ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts
	#ANCHOR_PROVIDER_URL=http://127.0.0.1:8899 ANCHOR_WALLET=~/.config/solana/id.json ts-mocha -p ./tsconfig.json -t 1000000 tests/**/test_puppet-cpi.ts
	ANCHOR_PROVIDER_URL=http://127.0.0.1:8899 ANCHOR_WALLET=~/.config/solana/id.json ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.rs
	ANCHOR_PROVIDER_URL=http://127.0.0.1:8899 ANCHOR_WALLET=~/.config/solana/id.json ts-mocha -p ./tsconfig.json -t 1000000 	tests/**/test_enhanced_nft_program.ts

keys:
	anchor keys list
sync-keys:
	anchor keys sync

# 删除部署的文件后，还得重启solana-test-validator
clean:
	anchor clean

# 展开代码
expand:
	#cargo expand --package p2 > expand_code/p2.rs
	cargo expand --package counter_anchor  > expand_code/counter_anchor.rs
#	cargo expand --features "idl-build" -p p2 > expand_code/p2.rs
	#cargo expand --package cpi_invoke_signed > expand_code/cpi_invoke_signed.rs
	cargo expand --package cpi_invoke_signed > expand_code/cpi_invoke_signed.rs

#最后一个参数是文件名，省略.rs后缀
expand_test_file:
	cargo expand --test test > czzexpandtest.rs


# 开启本地validator, 关掉vpn，不然会导致连接rpc服务失败
start-local-test-validator:
	solana-test-validator -u localhost
	#solana-test-validator -r

