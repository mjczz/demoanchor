
#### cargo expand generate code when idl-build's feature enabled processing flow

```rust
/// generated code
pub(crate) mod __client_accounts_increment {
    ///... 
    impl anchor_lang::idl::build::IdlBuild for Increment {
        fn create_type() -> Option<anchor_lang::idl::types::IdlTypeDef> {
            Some(anchor_lang::idl::types::IdlTypeDef {
                name: Self::get_full_path(),
                docs: <[_]>::into_vec(
                    #[rustc_box]
                    ::alloc::boxed::Box::new([
                        "Generated client accounts for [`Increment`].".into(),
                    ]),
                ),
                serialization: anchor_lang::idl::types::IdlSerialization::default(),
                repr: None,
                generics: ::alloc::vec::Vec::new(),
                ty: anchor_lang::idl::types::IdlTypeDefTy::Struct {
                    fields: Some(
                        anchor_lang::idl::types::IdlDefinedFields::Named(
                            <[_]>::into_vec(
                                #[rustc_box]
                                ::alloc::boxed::Box::new([
                                    anchor_lang::idl::types::IdlField {
                                        name: "counter".into(),
                                        docs: ::alloc::vec::Vec::new(),
                                        ty: anchor_lang::idl::types::IdlType::Pubkey,
                                    },
                                ]),
                            ),
                        ),
                    ),
                },
            })
        }
        fn insert_types(
            types: &mut std::collections::BTreeMap<
                String,
                anchor_lang::idl::types::IdlTypeDef,
            >,
        ) {}
        fn get_full_path() -> String {
            ::alloc::__export::must_use({
                let res = ::alloc::fmt::format(
                    format_args!(
                        "{0}::{1}",
                        "p2::__client_accounts_increment",
                        "Increment",
                    ),
                );
                res
            })
        }
    }
    /// ....
}

```


```rust
/// key step 1
/// lang/syn/src/codegen/accounts/mod.rs:24
let __client_accounts_mod = __client_accounts::generate(accs, quote!(crate::ID));


/// lang/syn/src/codegen/accounts/__client_accounts.rs:171
#[derive(anchor_lang::AnchorSerialize)]
pub struct #name {
#(#account_struct_fields),*
}
```

```rust
/// key step 2
/// lang/derive/serde/src/lib.rs:29

#[proc_macro_derive(AnchorSerialize, attributes(borsh_skip))]
pub fn anchor_serialize(input: TokenStream) -> TokenStream {
    #[cfg(not(feature = "idl-build"))]
    let ret = gen_borsh_serialize(input);
    #[cfg(feature = "idl-build")]
    let ret = gen_borsh_serialize(input.clone());

    #[cfg(feature = "idl-build")]
    {
        use anchor_syn::idl::*;
        use quote::quote;

        let idl_build_impl = match syn::parse(input).unwrap() {
            Item::Struct(item) => impl_idl_build_struct(&item), // final processing method
            Item::Enum(item) => impl_idl_build_enum(&item),
            Item::Union(item) => impl_idl_build_union(&item),
            // Derive macros can only be defined on structs, enums, and unions.
            _ => unreachable!(),
        };

        return TokenStream::from(quote! {
            #ret
            #idl_build_impl
        });
    };

    #[allow(unreachable_code)]
    TokenStream::from(ret)
}

```