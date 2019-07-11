import React from 'react';
import { View } from 'react-native';
import { createStyles, maxWidth } from '../component/media-query';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Background from '../component/background';
import MainContent from '../component/main-content';
import { CopyOnboardText, Text } from '../component/text';
import { RadioButton, GlasButton } from '../component/button';
import { SettingItem } from '../component/setting';
import { color, font, smallBreakWidth } from '../component/style';

//
// Select Autopilot View
//

const baseStyles = {
  content: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  title: {
    marginTop: 60,
    textAlign: 'center',
  },
  copyTxt: {
    textAlign: 'center',
    marginTop: 10,
    maxWidth: 300,
  },
  list: {
    marginTop: 50,
    width: undefined,
    alignSelf: 'stretch',
  },
};

const styles = createStyles(
  baseStyles,

  maxWidth(smallBreakWidth, {
    title: {
      fontSize: font.sizeL + 10,
      lineHeight: font.sizeL + 10,
      marginTop: 40,
    },
    list: {
      marginTop: 20,
    },
  })
);

const SelectAutopilotView = ({ store, autopilot, info }) => (
  <Background color={color.blackDark}>
    <MainContent style={styles.content}>
      <CopyOnboardText style={styles.title}>
        Automatically set up channels?
      </CopyOnboardText>
      <Text style={styles.copyTxt}>
        {
          "If you want to avoid manual channel creation, the app can allocate funds to channels for you. It's called autopilot."
        }
      </Text>
      <View style={styles.list}>
        <SettingItem
          name="Use autopilot (recommended)"
          copy="I want the app to create channels and move my funds into those channels automatically."
          onSelect={() => (store.settings.autopilot ? {} : autopilot.toggle())}
        >
          <RadioButton selected={store.settings.autopilot === true} />
        </SettingItem>
        <SettingItem
          name="Create channels manually"
          copy="I don't want the app to automatically create channels for me. I can do this all myself."
          onSelect={() => (!store.settings.autopilot ? {} : autopilot.toggle())}
        >
          <RadioButton selected={store.settings.autopilot === false} />
        </SettingItem>
      </View>
    </MainContent>
    <GlasButton onPress={() => info.initLoaderSyncing()}>Next</GlasButton>
  </Background>
);

SelectAutopilotView.propTypes = {
  store: PropTypes.object.isRequired,
  autopilot: PropTypes.object.isRequired,
  info: PropTypes.object.isRequired,
};

export default observer(SelectAutopilotView);
