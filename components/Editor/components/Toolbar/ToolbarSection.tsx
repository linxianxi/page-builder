import { useNode } from '@craftjs/core';
import { Grid, Divider } from '@chakra-ui/react';
import React from 'react';

export const ToolbarSection = ({ title, props, summary, children }: any) => {
  const { nodeProps } = useNode((node) => ({
    nodeProps:
      props &&
      props.reduce((res: any, key: any) => {
        res[key] = node.data.props[key] || null;
        return res;
      }, {}),
  }));

  return null;
  // return (
  //   <ExpansionPanel classes={panelClasses}>
  //     <ExpansionPanelSummary classes={summaryClasses}>
  //       <div className="px-6 w-full">
  //         <Grid container direction="row" alignItems="center" spacing={3}>
  //           <Grid item xs={4}>
  //             <h5 className="text-sm text-light-gray-1 text-left font-medium text-dark-gray">
  //               {title}
  //             </h5>
  //           </Grid>
  //           {summary && props ? (
  //             <Grid item xs={8}>
  //               <h5 className="text-light-gray-2 text-sm text-right text-dark-blue">
  //                 {summary(
  //                   props.reduce((acc: any, key: any) => {
  //                     acc[key] = nodeProps[key];
  //                     return acc;
  //                   }, {})
  //                 )}
  //               </h5>
  //             </Grid>
  //           ) : null}
  //         </Grid>
  //       </div>
  //     </ExpansionPanelSummary>
  //     <ExpansionPanelDetails style={{ padding: '0px 24px 20px' }}>
  //       <Divider />
  //       <Grid container spacing={1}>
  //         {children}
  //       </Grid>
  //     </ExpansionPanelDetails>
  //   </ExpansionPanel>
  // );
};
