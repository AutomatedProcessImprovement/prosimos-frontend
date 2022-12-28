// import React, { Component, useState } from 'react';
// import { Query, Builder, Utils as QbUtils, JsonTree, Config, QueryProps, BuilderProps } from "react-awesome-query-builder";

// // For AntDesign widgets only:
// // import AntdConfig from 'react-awesome-query-builder/lib/config/antd';
// // import 'antd/dist/antd.css'; // or import "react-awesome-query-builder/css/antd.less";
// // For MUI 4/5 widgets only:
// import { Config as LibConfig, Fields as LibFields, ImmutableTree } from 'react-awesome-query-builder/lib/index';
// // import MaterialConfig from 'react-awesome-query-builder/lib/config/material';
// import MuiConfig from 'react-awesome-query-builder/lib/config/mui';
// // For Bootstrap widgets only:
// // import BootstrapConfig from "react-awesome-query-builder/lib/config/bootstrap";

// import 'react-awesome-query-builder/lib/css/styles.css';
// import 'react-awesome-query-builder/lib/css/compact_styles.css'; //optional, for more compact styles

// // Choose your skin (ant/material/vanilla):
// const InitialConfig: LibConfig = MuiConfig // MaterialConfig or MuiConfig or BootstrapConfig or BasicConfig

// // You need to provide your own config. See below 'Config format'
// const config: LibConfig = {
//     ...InitialConfig,
//     fields: {
//         qty: {
//             label: 'Qty',
//             type: 'number',
//             fieldSettings: {
//                 min: 0,
//             },
//             operators: ['less_or_equal', 'less', 'equal', 'between'],
//             valueSources: ['value'],
//             preferWidgets: ['number'],
//         },
//         price: {
//             label: 'Price',
//             type: 'number',
//             valueSources: ['value'],
//             fieldSettings: {
//                 min: 10,
//                 max: 100,
//             },
//             preferWidgets: ['slider', 'rangeslider'],
//         },
//         color: {
//             label: 'Color',
//             type: 'select',
//             valueSources: ['value'],
//             fieldSettings: {
//                 listValues: [
//                     { value: 'yellow', title: 'Yellow' },
//                     { value: 'green', title: 'Green' },
//                     { value: 'orange', title: 'Orange' }
//                 ],
//             }
//         },
//         is_promotion: {
//             label: 'Promo?',
//             type: 'boolean',
//             operators: ['equal'],
//             valueSources: ['value'],
//         },
//     } as LibFields
// };

// // You can load query value from your backend storage (for saving see `Query.onChange()`)
// const queryValue = { "id": QbUtils.uuid(), "type": "group" } as JsonTree;

// interface IState {
//     tree: any;
//     config: Config;
// }

// const DemoQueryBuilder = () => {
//     const [state, setState] = React.useState<IState>({
//         tree: QbUtils.checkTree(QbUtils.loadTree(queryValue), config as Config) as any,
//         config: config as Config
//     } as IState);

//     const renderBuilder = (props: JSX.IntrinsicAttributes & BuilderProps & { children?: React.ReactNode; }) => (
//         <div className="query-builder-container" style={{ padding: '10px' }}>
//             <div className="query-builder qb-lite">
//                 <Builder {...props} />
//             </div>
//         </div>
//     )

//     const renderResult = ({ tree: immutableTree, config }: { tree: any, config: any }) => (
//         <div className="query-builder-result">
//             <div>Query string: <pre>{JSON.stringify(QbUtils.queryString(immutableTree, config))}</pre></div>
//             <div>MongoDb query: <pre>{JSON.stringify(QbUtils.mongodbFormat(immutableTree, config))}</pre></div>
//             <div>SQL where: <pre>{JSON.stringify(QbUtils.sqlFormat(immutableTree, config))}</pre></div>
//             <div>JsonLogic: <pre>{JSON.stringify(QbUtils.jsonLogicFormat(immutableTree, config))}</pre></div>
//         </div>
//     )

//     const onChange = (immutableTree: ImmutableTree, config: any) => {
//         // Tip: for better performance you can apply `throttle` - see `examples/demo`
//         setState({ tree: immutableTree, config: config });

//         const jsonTree = QbUtils.getTree(immutableTree);
//         console.log(jsonTree);
//         // `jsonTree` can be saved to backend, and later loaded to `queryValue`
//     }

//     return (
//         <div>
//             <Query
//                 {...state.config}
//                 value={state.tree}
//                 onChange={onChange}
//                 renderBuilder={renderBuilder}
//             />
//             {renderResult(state)}
//         </div>
//     )
// }

// export default DemoQueryBuilder;

const DemoQueryBuilder = () => {
    return <div></div>
}

export default DemoQueryBuilder;
