// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    HOME_URL:`http://172.16.8.112:8091/`,
    SERVER_NAME:`lh_mes`,
    chore: false,
    SERVER_URL: `http://172.16.8.112:81/cloudblock_lhoracle/`,
    RESOURCE_SERVER_URL: `http://172.16.8.112:81/`,
    DATA_SERVER_URL:`http://172.16.8.107:8082/cloudblock_datapull/`,
    //SERVER_URL: `http://192.168.200.149:8080/cloudblock_spring_boot_oracle_war_exploded/`,
    production: false,
    hmr: false,
    useHash: false,
    logger:{
        level:5                                 
    },
    version:`100`
};
