/** @jsx jsx */
import {
    Box,
    ColorModeProvider,
    CSSReset,
    ThemeProvider,
    useColorMode,
    useTheme,
    theme,
    Button,
} from '@chakra-ui/react'
import { Stack, Flex } from '@chakra-ui/react'
import merge from 'lodash/fp/merge'
import { jsx } from '@emotion/react'
import { useDokzConfig, TableOfContentsContext, useAnimationComponent } from '../provider'
import NavBar from './NavBar'
import NextHead from 'next/head'
import { SideNav } from './SideNav'
import { Global, css } from '@emotion/react'
import { FloatingTableOfContents } from './FloatingTableOfContents'
import { Fragment, useMemo } from 'react'
import { globalStyles, getMdxSidebarTree } from './support'
import { FooterButtons } from './FooterButtons'
import { useRouter } from 'next/router'

const SIDENAV_W = 280
const TABLE_OF_C_W = 200

const NAVBAR_H = 82

export function Wrapper(props) {
    const { tableOfContents, name, ...rest } = props.meta || {}
    const {
        footer,
        headerLogo,
        headerItems,
        maxPageWidth,
        bodyColor,
        bodyBackgroundColor,
        fontSize,
        fontWeight,
        fontFamily,
        headTitlePrefix = '',
    } = useDokzConfig()
    const index = getMdxSidebarTree()
    const router = useRouter()
    const { colorMode } = useColorMode()
    const Faded = useAnimationComponent()
    return (
        <PropagatedThemeProvider theme={theme}>
            <NextHead>
                {name && (
                    <title>
                        {headTitlePrefix}
                        {name}
                    </title>
                )}
            </NextHead>
            <TableOfContentsContext.Provider value={{ tableOfContents }}>
                {/* <CSSReset /> */}
                <Global styles={globalStyles} />
                <Stack
                    className='dokz visibleInPrint noMarginInPrint'
                    align='center'
                    minHeight='100%'
                    color={bodyColor[colorMode]}
                    backgroundColor={bodyBackgroundColor[colorMode]}
                    fontSize={fontSize}
                    fontFamily={fontFamily}
                    fontWeight={fontWeight}
                    // color={colorMode == 'dark' ? 'white' : black}
                >
                    <Box
                        className='dokz visibleInPrint'
                        minHeight='100%'
                        position='relative'
                        w='100%'
                        maxWidth={maxPageWidth}
                    >
                        <NavBar
                            px='6'
                            className='dokz hiddenInPrint'
                            logo={headerLogo}
                            items={headerItems}
                            tree={index}
                            height={NAVBAR_H + 'px'}
                            // maxW={PAGE_MAX_W}
                            position='fixed'
                            // mr='auto'
                            // top={0}
                            left={0}
                            right={0}
                        />
                        <SideNav
                            css={css`
                                -webkit-overflow-scrolling: touch;
                            `}
                            pl='6'
                            className='dokz hiddenInPrint'
                            alignSelf='flex-start'
                            position='fixed'
                            top={NAVBAR_H}
                            bottom={0}
                            fontSize='0.9em'
                            // fontWeight='500'
                            // left={0}
                            tree={index}
                            // height='100%'
                            width={SIDENAV_W}
                            display={['none', null, 'block']}
                            overflowY='auto'
                            overflowX='hidden'
                        />
                        <Stack
                            direction='row'
                            minHeight='100%'
                            className='dokz visibleInPrint noMarginInPrint'
                            align='stretch'
                            ml={['none', null, SIDENAV_W]}
                            // mr={['none', null, TABLE_OF_C_W + 30 + 'px']}
                            mt={[NAVBAR_H + 'px']}
                        >
                            <Stack
                                minHeight={`calc(100vh - ${NAVBAR_H}px)`}
                                className='dokz visibleInPrint mainContent'
                                direction='column'
                                align='stretch'
                                overflowY='visible'
                                px={['10px', null, '20px', '30px']}
                                // spacing='10px'
                                flex='1'
                                minW='0'
                                borderRightWidth={[
                                    '0px',
                                    null,
                                    null,
                                    null,
                                    '1px',
                                ]}
                                borderLeftWidth={['0px', null, '1px']}
                            >
                                <Stack
                                    as={Faded}
                                    cascade
                                    spacing='2em'
                                    align='stretch'
                                >
                                    {props.children}
                                    <FooterButtons
                                        className='dokz hiddenInPrint'
                                        mt='60px !important'
                                        mb='2em !important'
                                        width='100%'
                                    />
                                    {footer}
                                </Stack>
                            </Stack>
                            <FloatingTableOfContents
                                className='dokz hiddenInPrint'
                                fontSize='0.9em'
                                // fontWeight='400'
                                position='sticky'
                                alignSelf='flex-start'
                                top={NAVBAR_H}
                                width={TABLE_OF_C_W + 'px'}
                                // right={0}
                                ml='auto'
                                height='auto'
                                display={['none', null, null, null, 'block']}
                                pt='20px'
                                overflowX='visible'
                                opacity={0.8}
                                table={tableOfContents}
                            />
                        </Stack>
                    </Box>
                </Stack>
                {/* <PageTransition path={router?.pathname} /> */}
            </TableOfContentsContext.Provider>
        </PropagatedThemeProvider>
    )
}

export function PropagatedThemeProvider({ theme, children }) {
    const existingTheme = useTheme()
    // console.log({ existingTheme: existingTheme.sizes })
    const merged = useMemo(() => {
        return merge(existingTheme, theme)
    }, [theme, existingTheme])
    return <ThemeProvider theme={merged}>{children}</ThemeProvider>
}
