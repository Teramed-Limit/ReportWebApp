import * as React from 'react';

// import { Button } from '@mui/material';
import { Button, Stack } from '@mui/material';
import { TreeItem, TreeItemProps } from '@mui/x-tree-view/TreeItem';

import { SRTreeNode } from '../../../../../interface/sr-tree';
import { SRTreeItemContent } from '../SRTreeItemContent/SRTreeItemContent';

interface Props extends TreeItemProps {
    node: SRTreeNode;
    getSRNodePath: (nodeIds: string, type: 'Value' | 'ValueWithUnit') => void;
}

export const SRTreeItem = (props: Props) => {
    return (
        <TreeItem ContentComponent={SRTreeItemContent} {...props}>
            {props.children}
            {props.node?.Value?.Value && (
                <Stack direction="row">
                    <Button
                        sx={{ height: '20px', ml: '30px', mb: '8px' }}
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={() => props.getSRNodePath(props.node.NodeId, 'Value')}
                    >
                        Apply Value
                    </Button>
                    {props.node.Value.Unit && (
                        <Button
                            sx={{ height: '20px', ml: '8px', mb: '8px' }}
                            size="small"
                            variant="contained"
                            color="secondary"
                            onClick={() => props.getSRNodePath(props.node.NodeId, 'ValueWithUnit')}
                        >
                            Apply Value Unit
                        </Button>
                    )}
                    {/*{props.node.Value.UnitMeaning && (*/}
                    {/*    <Button*/}
                    {/*        sx={{ height: '20px', ml: '8px' }}*/}
                    {/*        size="small"*/}
                    {/*        variant="contained"*/}
                    {/*        color="success"*/}
                    {/*        onClick={(e) =>*/}
                    {/*            props.getSRNodePath(e, props.node.NodeId, 'UnitMeaning')*/}
                    {/*        }*/}
                    {/*    >*/}
                    {/*        Apply Value Meaning*/}
                    {/*    </Button>*/}
                    {/*)}*/}
                </Stack>
            )}
        </TreeItem>
    );
};
