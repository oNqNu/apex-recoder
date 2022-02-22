import {
  Box,
  Button,
  Center,
  chakra,
  ChakraProvider,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Image,
  Input,
  Radio,
  RadioGroup,
  Spacer,
  Stat,
  StatArrow,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
} from '@chakra-ui/react'
import { MyStat, MyRankStat } from './component/stat'
import axios from 'axios'
import React, { useState } from 'react'
function App() {
  const [formValues, setFormValues] = useState({
    platform: '',
    id: '',
  })

  const [user, setUser] = useState<any>()
  const [errorMsg, setErrorMsg] = useState('')

  const statItems = [
    { label: 'level', name: 'Level' },
    { label: 'kills', name: 'キル数' },
    { label: 'damage', name: '累計ダメージ' },
    { label: 'killsPerMatch', name: 'kill / match' },
    { label: 'damagePerMatch', name: 'ダメージ / match' },
    { label: 'finishers', name: '累計フィニッシャー数' },
    { label: 'killsAsKillLeader', name: 'キルリーダーとしてのキル数' },
    { label: 'headshots', name: '累計ヘッドショット数' },
    { label: 'shotgunKills', name: 'ショットガンキル数' },
    { label: 'arKills', name: 'アサルトライフルキル数' },
    { label: 'lmgKills', name: 'LMGキル数' },
  ]
  const rankStatItems = [
    { label: 'rankScore', name: 'バトロワランク' },
    { label: 'arenaRankScore', name: 'アリーナランク' },
  ]
  const [isLoading, setIsLoading] = useState(false)

  function handleChange(name, value) {
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  const overview = user?.segments.find((v) => v.type === 'overview').stats

  return (
    <ChakraProvider>
      <chakra.main
        bgColor='white'
        minH='100vh'
        fontFamily='sans-serif'
        color='white'
        backgroundImage={`url(${process.env.PUBLIC_URL}/bg1.jpg)`}
        backgroundAttachment='fixed'
        backgroundSize='cover'
        p='0'
      >
        <Box minH='100vh' backgroundColor='rgba(0,0,0,0.4)'>
          <Container maxW='3xl'>
            <Heading align='center' pt='10' fontSize={['2xl', '5xl']}>
              Apex Legends 戦績checker
            </Heading>
            <Box>
              <FormControl mt='10'>
                <FormLabel fontSize={['lg', '2xl']}>
                  プラットフォームを選択してください．
                </FormLabel>
                <RadioGroup
                  defaultValue='psn'
                  value={formValues.platform}
                  onChange={(value) => handleChange('platform', value)}
                >
                  <HStack spacing='24px'>
                    <Radio value='origin'>origin</Radio>
                    <Radio value='psn'>play station</Radio>
                    <Radio value='xbl'>x box</Radio>
                  </HStack>
                </RadioGroup>
              </FormControl>
              <FormControl mt='4'>
                <FormLabel htmlFor='id' fontSize={['lg', '2xl']}>
                  IDを入力してください．
                </FormLabel>
                <Input
                  id='id'
                  value={formValues.id}
                  placeholder='id'
                  onChange={(e) => handleChange('id', e.target.value)}
                  bgColor='rgba(255,255,255,0.2)'
                />
              </FormControl>
            </Box>
            <Center>
              <Button
                size='lg'
                type='submit'
                colorScheme='teal'
                variant='solid'
                isLoading={isLoading}
                align='center'
                mt='4'
                onClick={async (e) => {
                  setIsLoading(true)
                  setErrorMsg('')
                  await axios(
                    `https://asia-northeast1-spsheet-test-328520.cloudfunctions.net/getApexData?platform=${formValues.platform}&id=${formValues.id}`
                  )
                    .then(({ data }) => {
                      setUser(data)
                      console.log(data)
                    })
                    .catch((error) => {
                      console.log(error)
                      setUser(null)
                      setErrorMsg(
                        '正しくプラットフォーム,IDを入力してください.'
                      )
                    })
                  setIsLoading(false)
                }}
              >
                戦績を確認する
              </Button>
            </Center>
            <Text mt='4' align='center' color='red.500'>
              {errorMsg}
            </Text>

            {user && (
              <>
                <Center color='black'>
                  <Flex
                    mx='32'
                    mt='4'
                    px='8'
                    bgColor='rgba(255,255,255,0.8)'
                    w='400px'
                    h={['32', '40']}
                    borderRadius='3xl'
                    border='1px'
                    borderColor='gray.200'
                    boxShadow='xl'
                  >
                    <Box pt='10' px='4'>
                      <Text fontSize={['sm', 'md']} align='center'>
                        Your ID
                      </Text>
                      <Text
                        fontSize={['lg', '2xl']}
                        fontWeight='bold'
                        align='center'
                        borderBottom='solid 2px black'
                      >
                        {user.platformInfo.platformUserId}
                      </Text>
                    </Box>
                    <Spacer />

                    <Box w={['24', '32']} h={['24', '32']} p='2' my='auto'>
                      <Image src={user.platformInfo.avatarUrl} />
                    </Box>
                  </Flex>
                </Center>
                {user.platformInfo.platformUserId.toUpperCase() === 'ONQNU' ? (
                  <Text
                    fontSize={['xl', '3xl']}
                    align='center'
                    mt='8'
                    color='white'
                  >
                    俺の戦績は国家機密だよ，出直してください😘
                  </Text>
                ) : (
                  <>
                    <StatGroup mt='4' display='flex' color='black'>
                      {rankStatItems.map(
                        (item) =>
                          overview[item.label] && (
                            // <Flex
                            //   bgColor='rgba(255,255,255,0.8)'
                            //   border='1px'
                            //   borderColor='gray.200'
                            //   boxShadow='xl'
                            //   borderRadius='xl'
                            //   p='4'
                            //   m='2'
                            //   maxW='lg'
                            // >
                            //   <Stat pr='1'>
                            //     <StatLabel fontSize={['md', 'xl']}>
                            //       {item.name}
                            //     </StatLabel>
                            //     <Text>
                            //       {overview[item.label].metadata.rankName}
                            //     </Text>
                            //     <StatNumber
                            //       fontSize={['2xl', '3xl']}
                            //       borderBottom='solid 2px black'
                            //     >
                            //       {overview[item.label].value}rp
                            //     </StatNumber>
                            //     <StatHelpText>
                            //       <StatArrow type='increase' />
                            //       {overview[item.label].rank
                            //         ? `${overview[item.label].rank}位`
                            //         : 'ランキング圏外'}
                            //     </StatHelpText>
                            //   </Stat>
                            //   <Center>
                            //     <Image
                            //       src={overview[item.label].metadata.iconUrl}
                            //     />
                            //   </Center>
                            // </Flex>
                            <MyRankStat item={item} overview={overview} />
                          )
                      )}
                    </StatGroup>
                    <StatGroup
                      display='grid'
                      gridTemplateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']}
                      mt='10'
                      mx='4'
                      color='black'
                    >
                      {statItems.map(
                        (item) =>
                          overview[item.label] && (
                            <MyStat item={item} overview={overview} />
                          )
                      )}
                    </StatGroup>
                  </>
                )}
              </>
            )}
            <Text
              fontSize={['lg', '2xl']}
              align='right'
              fontWeight='semibold'
              fontStyle='italic'
              mt='8'
            >
              prod by oNqNu
            </Text>
          </Container>
        </Box>
      </chakra.main>
    </ChakraProvider>
  )
}

export default App
