// material-ui
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'components/MainCard';

// assets
import DownOutlined from '@ant-design/icons/DownOutlined';
import RightOutlined from '@ant-design/icons/RightOutlined';

// ==============================|| TREE VIEW - DISABLED ||============================== //

export default function DisabledTreeView() {
  const disabledTreeviewCodeString = `<SimpleTreeView aria-label="disabled items" slots={{ collapseIcon: DownOutlined, expandIcon: RightOutlined }} multiSelect>
  <TreeItem itemId="1" label="One">
    <TreeItem itemId="2" label="Two" />
    <TreeItem itemId="3" label="Three" />
    <TreeItem itemId="4" label="Four" />
  </TreeItem>
  <TreeItem itemId="5" label="Five" disabled>
    <TreeItem itemId="6" label="Six" />
  </TreeItem>
  <TreeItem itemId="7" label="Seven">
    <TreeItem itemId="8" label="Eight" />
    <TreeItem itemId="9" label="Nine">
      <TreeItem itemId="10" label="Ten">
        <TreeItem itemId="11" label="Eleven" />
        <TreeItem itemId="12" label="Twelve" />
      </TreeItem>
    </TreeItem>
  </TreeItem>
</SimpleTreeView>`;

  return (
    <MainCard title="Disabled" codeString={disabledTreeviewCodeString}>
      <Box sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}>
        <SimpleTreeView aria-label="disabled items" slots={{ collapseIcon: DownOutlined, expandIcon: RightOutlined }} multiSelect>
          <TreeItem itemId="1" label="One">
            <TreeItem itemId="2" label="Two" />
            <TreeItem itemId="3" label="Three" />
            <TreeItem itemId="4" label="Four" />
          </TreeItem>
          <TreeItem itemId="5" label="Five" disabled>
            <TreeItem itemId="6" label="Six" />
          </TreeItem>
          <TreeItem itemId="7" label="Seven">
            <TreeItem itemId="8" label="Eight" />
            <TreeItem itemId="9" label="Nine">
              <TreeItem itemId="10" label="Ten">
                <TreeItem itemId="11" label="Eleven" />
                <TreeItem itemId="12" label="Twelve" />
              </TreeItem>
            </TreeItem>
          </TreeItem>
        </SimpleTreeView>
      </Box>
    </MainCard>
  );
}
