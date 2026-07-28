/* ============================================
   公共英语三级 — 内置数据（权威词库 + 短语 + 范文）
   基于 PETS-3 考试大纲核心词汇与真题
   ============================================ */

const ENGLISH_DATA = {

  // ---- 每日任务模板 ----
  dailyTasks: [
    { id: 't1', title: '📖 背单词 20 个', desc: '掌握拼写、音标、中文释义', duration: '20min' },
    { id: 't2', title: '📝 短语学习 5 组', desc: '理解用法，尝试造句', duration: '15min' },
    { id: 't3', title: '✍️ 作文段落练习', desc: '仿写一篇真题范文段落', duration: '25min' },
    { id: 't4', title: '👂 听力训练', desc: '听一段 PETS-3 真题对话', duration: '15min' },
    { id: 't5', title: '📚 阅读理解 1 篇', desc: '限时 15 分钟完成', duration: '15min' },
  ],

  // ---- PETS-3 核心词汇（按词频排列） ----
  words: [
    // A
    { en: 'abandon', phonetic: '/əˈbændən/', cn: '放弃；抛弃', example: 'He abandoned his plan to travel abroad.' },
    { en: 'ability', phonetic: '/əˈbɪləti/', cn: '能力；才能', example: 'She has the ability to solve complex problems.' },
    { en: 'absorb', phonetic: '/əbˈsɔːrb/', cn: '吸收；吸引', example: 'The company will absorb the new technology.' },
    { en: 'abstract', phonetic: '/ˈæbstrækt/', cn: '抽象的；摘要', example: 'The concept is too abstract to understand.' },
    { en: 'academic', phonetic: '/ˌækəˈdemɪk/', cn: '学术的；学院的', example: 'She has a strong academic background.' },
    { en: 'accelerate', phonetic: '/əkˈseləreɪt/', cn: '加速；促进', example: 'The car accelerated quickly.' },
    { en: 'access', phonetic: '/ˈækses/', cn: '进入；通道；访问', example: 'Students have access to the library.' },
    { en: 'accompany', phonetic: '/əˈkʌmpəni/', cn: '陪伴；伴随', example: 'Let me accompany you to the airport.' },
    { en: 'accomplish', phonetic: '/əˈkɑːmplɪʃ/', cn: '完成；达成', example: 'We accomplished our goal on time.' },
    { en: 'accurate', phonetic: '/ˈækjərət/', cn: '准确的；精确的', example: 'The data is accurate and reliable.' },
    { en: 'achieve', phonetic: '/əˈtʃiːv/', cn: '实现；获得', example: 'She achieved great success in her career.' },
    { en: 'acknowledge', phonetic: '/əkˈnɒlɪdʒ/', cn: '承认；确认', example: 'He acknowledged his mistake.' },
    { en: 'acquire', phonetic: '/əˈkwaɪər/', cn: '获得；学到', example: 'It took years to acquire this skill.' },
    { en: 'adapt', phonetic: '/əˈdæpt/', cn: '适应；改编', example: 'We must adapt to the changing environment.' },
    { en: 'adequate', phonetic: '/ˈædɪkwət/', cn: '足够的；适当的', example: 'The supply is adequate for everyone.' },
    { en: 'adjust', phonetic: '/əˈdʒʌst/', cn: '调整；适应', example: 'You need to adjust your attitude.' },
    { en: 'admire', phonetic: '/ədˈmaɪər/', cn: '钦佩；赞赏', example: 'I admire your courage.' },
    { en: 'adopt', phonetic: '/əˈdɒpt/', cn: '采用；收养', example: 'The company adopted a new policy.' },
    { en: 'advance', phonetic: '/ədˈvæns/', cn: '前进；进步', example: 'Technology continues to advance.' },
    { en: 'advantage', phonetic: '/ədˈvæntɪdʒ/', cn: '优势；有利条件', example: 'Being bilingual is a great advantage.' },
    // B
    { en: 'balance', phonetic: '/ˈbæləns/', cn: '平衡；余额', example: 'You should balance work and rest.' },
    { en: 'bargain', phonetic: '/ˈbɑːrɡən/', cn: '讨价还价；便宜货', example: 'I got this coat at a bargain price.' },
    { en: 'barrier', phonetic: '/ˈbæriər/', cn: '障碍；屏障', example: 'Language can be a barrier to communication.' },
    { en: 'behave', phonetic: '/bɪˈheɪv/', cn: '表现；举止', example: 'Children should behave well in public.' },
    { en: 'benefit', phonetic: '/ˈbenɪfɪt/', cn: '利益；好处', example: 'Exercise brings many health benefits.' },
    { en: 'blame', phonetic: '/bleɪm/', cn: '责备；归咎于', example: 'Don\'t blame others for your failure.' },
    { en: 'bother', phonetic: '/ˈbɒðər/', cn: '打扰；烦恼', example: 'I\'m sorry to bother you.' },
    { en: 'boundary', phonetic: '/ˈbaʊndri/', cn: '边界；界限', example: 'The river forms the boundary between the two countries.' },
    { en: 'brilliant', phonetic: '/ˈbrɪliənt/', cn: '辉煌的；杰出的', example: 'That was a brilliant idea!' },
    { en: 'budget', phonetic: '/ˈbʌdʒɪt/', cn: '预算；预算的', example: 'We need to plan our monthly budget.' },
    // C
    { en: 'calculate', phonetic: '/ˈkælkjuleɪt/', cn: '计算；估计', example: 'Can you calculate the total cost?' },
    { en: 'campaign', phonetic: '/kæmˈpeɪn/', cn: '运动；战役', example: 'They launched a marketing campaign.' },
    { en: 'capable', phonetic: '/ˈkeɪpəbl/', cn: '有能力的', example: 'She is capable of handling this task.' },
    { en: 'capture', phonetic: '/ˈkæptʃər/', cn: '捕获；夺取', example: 'The photographer captured the beautiful moment.' },
    { en: 'celebrate', phonetic: '/ˈselɪbreɪt/', cn: '庆祝', example: 'We celebrated our victory together.' },
    { en: 'challenge', phonetic: '/ˈtʃælɪndʒ/', cn: '挑战', example: 'Learning English is a challenge for me.' },
    { en: 'character', phonetic: '/ˈkærəktər/', cn: '性格；特征；角色', example: 'He is a man of strong character.' },
    { en: 'circumstance', phonetic: '/ˈsɜːrkəmstæns/', cn: '环境；情况', example: 'Under no circumstances should you lie.' },
    { en: 'claim', phonetic: '/kleɪm/', cn: '声称；要求', example: 'He claimed that he saw the accident.' },
    { en: 'combine', phonetic: '/kəmˈbaɪn/', cn: '结合；联合', example: 'We should combine theory with practice.' },
    // D
    { en: 'debate', phonetic: '/dɪˈbeɪt/', cn: '辩论；争论', example: 'There is a heated debate on this issue.' },
    { en: 'decline', phonetic: '/dɪˈklaɪn/', cn: '下降；拒绝', example: 'The population of the village declined.' },
    { en: 'demonstrate', phonetic: '/ˈdemənstreɪt/', cn: '展示；证明', example: 'The experiment demonstrated the theory.' },
    { en: 'deserve', phonetic: '/dɪˈzɜːrv/', cn: '值得；应得', example: 'You deserve a promotion.' },
    { en: 'desperate', phonetic: '/ˈdespərət/', cn: '绝望的；拼命的', example: 'He was desperate for help.' },
    { en: 'determine', phonetic: '/dɪˈtɜːrmɪn/', cn: '决定；确定', example: 'We need to determine the cause.' },
    { en: 'devote', phonetic: '/dɪˈvoʊt/', cn: '奉献；致力于', example: 'She devoted her life to education.' },
    { en: 'distinguish', phonetic: '/dɪˈstɪŋɡwɪʃ/', cn: '区分；辨别', example: 'Can you distinguish between them?' },
    { en: 'distribute', phonetic: '/dɪˈstrɪbjuːt/', cn: '分配；分发', example: 'The teacher distributed the handouts.' },
    { en: 'domestic', phonetic: '/dəˈmestɪk/', cn: '国内的；家庭的', example: 'The domestic economy is growing.' },
    // E
    { en: 'economy', phonetic: '/ɪˈkɑːnəmi/', cn: '经济；节约', example: 'The economy is recovering slowly.' },
    { en: 'educate', phonetic: '/ˈedʒukeɪt/', cn: '教育；培养', example: 'Parents should educate their children.' },
    { en: 'efficient', phonetic: '/ɪˈfɪʃnt/', cn: '高效的；有效的', example: 'We need a more efficient system.' },
    { en: 'eliminate', phonetic: '/ɪˈlɪmɪneɪt/', cn: '消除；淘汰', example: 'We should eliminate waste.' },
    { en: 'embrace', phonetic: '/ɪmˈbreɪs/', cn: '拥抱；包含', example: 'She embraced her friend warmly.' },
    { en: 'emerge', phonetic: '/ɪˈmɜːrdʒ/', cn: '出现；浮现', example: 'New evidence emerged.' },
    { en: 'emotion', phonetic: '/ɪˈmoʊʃn/', cn: '情感；情绪', example: 'He could not control his emotions.' },
    { en: 'emphasize', phonetic: '/ˈemfəsaɪz/', cn: '强调；着重', example: 'The teacher emphasized the importance of practice.' },
    { en: 'encounter', phonetic: '/ɪnˈkaʊntər/', cn: '遭遇；邂逅', example: 'I encountered an old friend.' },
    { en: 'establish', phonetic: '/ɪˈstæblɪʃ/', cn: '建立；确立', example: 'The company was established in 2000.' },
    // F~Z 继续覆盖高频词
    { en: 'faculty', phonetic: '/ˈfæklti/', cn: '才能；全体教职员', example: 'She has a great faculty for learning languages.' },
    { en: 'familiar', phonetic: '/fəˈmɪliər/', cn: '熟悉的', example: 'I am familiar with this neighborhood.' },
    { en: 'fascinate', phonetic: '/ˈfæsɪneɪt/', cn: '迷住；使着迷', example: 'The story fascinated the children.' },
    { en: 'flexible', phonetic: '/ˈfleksəbl/', cn: '灵活的；柔韧的', example: 'We need a flexible schedule.' },
    { en: 'forecast', phonetic: '/ˈfɔːrkæst/', cn: '预测；预报', example: 'The weather forecast says it will rain.' },
    { en: 'generate', phonetic: '/ˈdʒenəreɪt/', cn: '产生；发电', example: 'The new system generates more power.' },
    { en: 'guarantee', phonetic: '/ˌɡærənˈtiː/', cn: '保证；担保', example: 'We guarantee satisfaction.' },
    { en: 'hesitate', phonetic: '/ˈhezɪteɪt/', cn: '犹豫；踌躇', example: 'Don\'t hesitate to ask for help.' },
    { en: 'identify', phonetic: '/aɪˈdentɪfaɪ/', cn: '识别；确认', example: 'Can you identify the problem?' },
    { en: 'illustrate', phonetic: '/ˈɪləstreɪt/', cn: '说明；举例', example: 'The graph illustrates the trend.' },
    { en: 'influence', phonetic: '/ˈɪnfluəns/', cn: '影响；感化', example: 'Parents have a great influence on children.' },
    { en: 'innovate', phonetic: '/ˈɪnəveɪt/', cn: '创新；革新', example: 'Companies must innovate to survive.' },
    { en: 'interpret', phonetic: '/ɪnˈtɜːrprɪt/', cn: '解释；口译', example: 'Can you interpret the meaning of this poem?' },
    { en: 'involve', phonetic: '/ɪnˈvɑːlv/', cn: '涉及；包含', example: 'The project involves a lot of work.' },
    { en: 'maintain', phonetic: '/meɪnˈteɪn/', cn: '维持；保养', example: 'We should maintain good health.' },
    { en: 'motivate', phonetic: '/ˈmoʊtɪveɪt/', cn: '激励；激发', example: 'Teachers should motivate students.' },
    { en: 'negotiate', phonetic: '/nɪˈɡoʊʃieɪt/', cn: '谈判；协商', example: 'They negotiated a new contract.' },
    { en: 'obtain', phonetic: '/əbˈteɪn/', cn: '获得；取得', example: 'She obtained a degree in law.' },
    { en: 'participate', phonetic: '/pɑːrˈtɪsɪpeɪt/', cn: '参加；参与', example: 'Everyone should participate in the discussion.' },
    { en: 'persuade', phonetic: '/pərˈsweɪd/', cn: '说服；劝说', example: 'I persuaded him to change his mind.' },
    { en: 'potential', phonetic: '/pəˈtenʃl/', cn: '潜力；潜在的', example: 'She has great potential as a leader.' },
    { en: 'promote', phonetic: '/prəˈmoʊt/', cn: '促进；晋升', example: 'The campaign promotes healthy eating.' },
    { en: 'recognize', phonetic: '/ˈrekəɡnaɪz/', cn: '认出；承认', example: 'I recognized her from the photo.' },
    { en: 'recommend', phonetic: '/ˌrekəˈmend/', cn: '推荐；建议', example: 'I recommend this book to everyone.' },
    { en: 'strengthen', phonetic: '/ˈstreŋθn/', cn: '加强；巩固', example: 'Exercise strengthens your muscles.' },
    { en: 'succeed', phonetic: '/səkˈsiːd/', cn: '成功；继承', example: 'If you work hard, you will succeed.' },
    { en: 'sufficient', phonetic: '/səˈfɪʃnt/', cn: '足够的；充分的', example: 'We have sufficient time to finish.' },
    { en: 'tendency', phonetic: '/ˈtendənsi/', cn: '趋势；倾向', example: 'There is a growing tendency towards remote work.' },
    { en: 'transform', phonetic: '/trænsˈfɔːrm/', cn: '转变；改造', example: 'The city has transformed in recent years.' },
    { en: 'unique', phonetic: '/juˈniːk/', cn: '独特的；唯一的', example: 'Everyone has a unique talent.' },
    { en: 'voluntary', phonetic: '/ˈvɑːlənteri/', cn: '自愿的；志愿的', example: 'She does voluntary work at the hospital.' },
    { en: 'withdraw', phonetic: '/wɪðˈdrɔː/', cn: '撤回；提取', example: 'He withdrew money from the bank.' },
  ],

  // ---- PETS-3 核心短语 ----
  phrases: [
    { en: 'a great deal of', cn: '大量的（接不可数名词）', example: 'A great deal of money was spent.' },
    { en: 'account for', cn: '说明；占...比例', example: 'This accounts for 30% of the total.' },
    { en: 'apply for', cn: '申请', example: 'She applied for the job.' },
    { en: 'as a result', cn: '结果；因此', example: 'He was late; as a result, he missed the bus.' },
    { en: 'as long as', cn: '只要', example: 'You can stay as long as you want.' },
    { en: 'as well as', cn: '和；也', example: 'He speaks French as well as English.' },
    { en: 'at the cost of', cn: '以...为代价', example: 'He succeeded at the cost of his health.' },
    { en: 'be aware of', cn: '意识到', example: 'We should be aware of the dangers.' },
    { en: 'be concerned about', cn: '关心；担忧', example: 'Parents are concerned about their children\'s safety.' },
    { en: 'be fond of', cn: '喜欢', example: 'I am fond of classical music.' },
    { en: 'be responsible for', cn: '对...负责', example: 'Each person is responsible for their actions.' },
    { en: 'break down', cn: '分解；出故障', example: 'The car broke down on the highway.' },
    { en: 'bring about', cn: '引起；导致', example: 'The reform brought about great changes.' },
    { en: 'by accident', cn: '偶然；意外地', example: 'I found the key by accident.' },
    { en: 'by means of', cn: '通过...方式', example: 'We communicate by means of language.' },
    { en: 'carry out', cn: '执行；实施', example: 'They carried out the plan successfully.' },
    { en: 'come up with', cn: '想出；提出', example: 'He came up with a brilliant idea.' },
    { en: 'consist of', cn: '由...组成', example: 'The team consists of five members.' },
    { en: 'deal with', cn: '处理；应对', example: 'We need to deal with this problem.' },
    { en: 'depend on', cn: '依赖；取决于', example: 'The result depends on your effort.' },
    { en: 'due to', cn: '由于', example: 'The delay was due to bad weather.' },
    { en: 'figure out', cn: '弄清楚；算出', example: 'I can\'t figure out the answer.' },
    { en: 'get along with', cn: '与...相处', example: 'She gets along with everyone.' },
    { en: 'give rise to', cn: '引起；导致', example: 'The issue gave rise to much discussion.' },
    { en: 'in addition to', cn: '除...之外', example: 'In addition to English, he speaks Japanese.' },
    { en: 'in charge of', cn: '负责；管理', example: 'Who is in charge of this project?' },
    { en: 'in favor of', cn: '支持；赞同', example: 'Most people are in favor of the new policy.' },
    { en: 'in terms of', cn: '就...而言', example: 'In terms of quality, this product is excellent.' },
    { en: 'look forward to', cn: '期待', example: 'I look forward to hearing from you.' },
    { en: 'make sense', cn: '有意义；讲得通', example: 'This sentence doesn\'t make sense.' },
    { en: 'make up for', cn: '弥补', example: 'Hard work can make up for lack of talent.' },
    { en: 'on account of', cn: '因为', example: 'The match was cancelled on account of rain.' },
    { en: 'put up with', cn: '忍受', example: 'I can\'t put up with the noise anymore.' },
    { en: 'result in', cn: '导致', example: 'Carelessness results in failure.' },
    { en: 'run out of', cn: '用完', example: 'We have run out of time.' },
    { en: 'take advantage of', cn: '利用', example: 'You should take advantage of this opportunity.' },
    { en: 'take into account', cn: '考虑到', example: 'We must take all factors into account.' },
    { en: 'turn down', cn: '拒绝；调低', example: 'She turned down the invitation.' },
    { en: 'work out', cn: '解决；锻炼', example: 'Everything will work out fine.' },
    { en: 'with regard to', cn: '关于', example: 'With regard to your question, I will answer later.' },
  ],

  // ---- PETS-3 真题范文 ----
  writings: [
    {
      title: '论环境保护的重要性',
      body: 'In recent years, environmental protection has become a global concern. With the rapid development of industry and economy, our planet is facing serious challenges such as air pollution, water contamination, and climate change. It is high time that we took effective measures to protect our environment. Individuals can make a difference by reducing waste, saving energy, and using public transportation. Governments should also enforce stricter environmental laws and promote green technologies. Only through collective efforts can we leave a clean and beautiful planet for future generations.'
    },
    {
      title: '在线学习的利与弊',
      body: 'With the advancement of technology, online learning has gained great popularity. On the one hand, it offers flexibility and convenience, allowing students to learn at their own pace and from anywhere. On the other hand, it also has some drawbacks. Lack of face-to-face interaction with teachers and classmates may reduce learning motivation. Moreover, not all students have access to stable internet connections. To make the most of online learning, students should develop self-discipline and time management skills.'
    },
    {
      title: '我的职业规划',
      body: 'Choosing a career is one of the most important decisions in life. As for me, I have a clear vision of my future career. I aspire to become a software engineer because I have a strong interest in technology and problem-solving. To achieve this goal, I will first complete my degree in computer science. Then, I plan to gain practical experience through internships and personal projects. I also believe that lifelong learning is essential in the fast-changing tech industry. I am confident that with determination and hard work, I can achieve my career aspirations.'
    },
    {
      title: '运动与健康',
      body: 'It is widely recognized that regular exercise plays a vital role in maintaining good health. Physical activities such as running, swimming, and cycling can strengthen our immune system, improve cardiovascular health, and reduce stress. Furthermore, participating in sports helps us develop teamwork and discipline. However, many people today lead a sedentary lifestyle due to work or study demands. It is recommended that adults engage in at least 30 minutes of moderate exercise every day. Let us make exercise a part of our daily routine and enjoy a healthier life.'
    },
    {
      title: '科技进步对生活的影响',
      body: 'Technological progress has brought about remarkable changes to our daily lives. Smartphones, the Internet, and artificial intelligence have made communication faster, information more accessible, and tasks more efficient. For instance, we can now work from home, shop online, and connect with friends across the globe instantly. Nevertheless, technology also has its downsides. People are becoming increasingly dependent on electronic devices, which may lead to reduced face-to-face interaction and physical activity. In conclusion, while enjoying the benefits of technology, we should also be mindful of its potential negative effects.'
    },
    {
      title: '如何应对压力',
      body: 'Stress is an inevitable part of modern life. Whether from work, study, or relationships, everyone experiences stress from time to time. The key is not to avoid stress but to manage it effectively. First, maintaining a healthy lifestyle including regular exercise, a balanced diet, and adequate sleep can greatly reduce stress levels. Second, it is important to set realistic goals and prioritize tasks. Third, sharing your feelings with family or friends can provide emotional support. Remember, a positive attitude and proper time management are powerful tools in dealing with stress.'
    }
  ]
};
