import {
  FilterButton,
  H1,
  IconByName,
  Layout,
  Loading,
  useWindowSize,
} from "@shiksha/common-lib";
import QuestionBox from "components/QuestionBox";
import WorksheetBox from "components/WorksheetBox";
import {
  HStack,
  Stack,
  Button,
  Text,
  Actionsheet,
  Box,
  Pressable,
  VStack,
  FormControl,
  Input,
  ScrollView,
} from "native-base";
import React from "react";
import { useTranslation } from "react-i18next";
import { getAllQuestions } from "services";
import manifest from "../manifest.json";

const defaultInputs = [
  {
    name: "Subject",
    attributeName: "subject",
    data: [
      "Social Science",
      "Science",
      "Mathematics",
      "Hindi",
      "English",
      "History",
      "Geography",
    ],
  },
  {
    name: "Class",
    attributeName: "gradeLevel",
    data: [
      "Class 1",
      "Class 2",
      "Class 3",
      "Class 4",
      "Class 5",
      "Class 6",
      "Class 7",
      "Class 8",
      "Class 9",
      "Class 10",
    ],
  },
  {
    name: "Topic",
    attributeName: "topic",
    data: [
      "भोजन के घटक",
      "भोजन: यह कहाँ से आता है?",
      "तंतु से वस्त्र तक",
      "संसाधन",
      "समानता",
      "संश्लेशित रेशे  और प्लास्टिक",
      "आखेट-खाद्य संग्राहक से भोजन उत्पादन तक",
    ],
  },
  {
    name: "Source",
    attributeName: "source",
    data: ["source 1", "source 2"],
  },
];

const autoGenerateInputs = [
  {
    name: "Number of Questions",
    attributeName: "number_of_questions",
    data: ["10", "20", "30", "40", "50"],
  },
  {
    name: "Add Question type",
    attributeName: "add_question_type",
    data: ["MCQ", "SA"],
  },
];

export default function CreateWorksheet({ footerLinks, appName }) {
  const { t } = useTranslation();
  const [pageName, setPageName] = React.useState();
  const [questions, setQuestions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [formObject, setFormObject] = React.useState({});
  const [width, height] = useWindowSize();
  const [worksheetName, setWorksheetName] = React.useState("Untitled");

  React.useEffect(async () => {
    if (pageName === "ListOfWorksheet") {
      const questions = await getAllQuestions(formObject);
      setQuestions(questions);
      setLoading(false);
    }
  }, [formObject, pageName === "ListOfWorksheet"]);

  if (loading) {
    return <Loading />;
  }

  const handleBackButton = () => {
    if (pageName === "success") {
      setFormObject({});
      setPageName();
      setWorksheetName("Untitled");
    } else if (pageName === "AddDescriptionPage") {
      setPageName("filterData");
    } else if (pageName === "filterData") {
      setPageName("ListOfWorksheet");
    } else if (pageName === "ListOfWorksheet") {
      setPageName("");
    } else {
      navigate(-1);
    }
  };

  if (pageName === "success") {
    return (
      <Layout
        _appBar={{
          onPressBackButton: handleBackButton,
          languages: manifest.languages,
          color: "successAlertText.500",
          _box: { bg: "successAlert.500" },
        }}
      >
        <Loading
          width={width}
          height={height - 230}
          customComponent={
            <VStack space="2" flex="1" width={width}>
              <VStack bg="successAlert.500" pb="100px" pt="32px">
                <IconByName
                  alignSelf="center"
                  name="CheckboxCircleLineIcon"
                  color="successAlertText.500"
                  _icon={{ size: 100 }}
                />
                <Box alignSelf="center">
                  <H1
                    fontSize="22px"
                    fontWeight="600"
                    color="successAlertText.500"
                  >
                    Worksheet Published
                  </H1>
                </Box>
              </VStack>
              <Box p="5">
                <WorksheetBox
                  {...{
                    item: {
                      id: 1,
                      image: "",
                      heading: "Maps of the World",
                      subHeading: "NCERT Workbook",
                      class: "V",
                      likes: "4",
                      comments: "0",
                      description:
                        "Worksheets help the kids in exploring multiple concepts and ideas. They develop fine motor skills and logical thinking.",
                      subject: "Math",
                      level: "Beginner",
                      grade: "VI",
                      questions: "30",
                      chapter: "3",
                      downloads: "3",
                    },
                  }}
                />
              </Box>
            </VStack>
          }
        />
        <Box
          bg="white"
          p="5"
          position="fixed"
          bottom="0"
          shadow={2}
          width={width}
        >
          <Button
            colorScheme="button"
            _text={{ color: "white" }}
            px="5"
            flex="1"
            onPress={handleBackButton}
          >
            {t("Back to Worksheets")}
          </Button>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout
      _header={{
        title:
          pageName === "ListOfWorksheet"
            ? t("Add Questions")
            : pageName === "filterData"
            ? worksheetName
            : pageName === "AddDescriptionPage"
            ? t("Add Description")
            : t("CREATE_NEW_WORKSHEET"),
        _subHeading: { fontWeight: 500, textTransform: "uppercase" },
      }}
      _appBar={{
        languages: manifest.languages,
        onPressBackButton: handleBackButton,
      }}
      subHeader={
        pageName === "ListOfWorksheet"
          ? worksheetName
            ? t("Your worksheet has been created.")
            : t("You can see all questions here")
          : pageName === "AddDescriptionPage"
          ? t("Enter Worksheet Details")
          : t("Show questions based on")
      }
      _subHeader={{
        bg: "worksheetCard.500",
        _text: {
          fontSize: "16px",
          fontWeight: "600",
          textTransform: "inherit",
        },
      }}
      _footer={footerLinks}
    >
      {["ListOfWorksheet", "filterData"].includes(pageName) ? (
        <ListOfWorksheet
          {...{
            questions,
            setQuestions,
            pageName,
            setPageName,
            filterObject: formObject,
            setFilterObject: setFormObject,
            worksheetName,
            setWorksheetName,
          }}
        />
      ) : pageName === "AddDescriptionPage" ? (
        <AddDescriptionPage {...{ questions, setQuestions, setPageName }} />
      ) : (
        <FormPage {...{ formObject, setFormObject, setPageName, setLoading }} />
      )}
    </Layout>
  );
}

const FormInput = ({
  data,
  formObject,
  setFormObject,
  formData,
  setFormData,
}) => {
  const { t } = useTranslation();
  return (
    data &&
    data.map((item, index) => {
      let attributeName = item.attributeName ? item.attributeName : item.name;
      return (
        <HStack
          key={index}
          bg="white"
          p="5"
          alignItems="center"
          justifyContent="space-between"
        >
          <Text fontSize={"14px"} fontWeight="500">
            {t(item.name)}
          </Text>
          <Button
            {...(formObject[attributeName]
              ? { _text: { color: "white", textTransform: "inherit" } }
              : item?.buttonVariant
              ? { variant: item.buttonVariant }
              : {
                  variant: "outline",
                  _text: { color: "button.500", textTransform: "inherit" },
                })}
            rounded="full"
            colorScheme="button"
            px="5"
            rightIcon={
              <IconByName
                color={
                  formObject[attributeName]
                    ? "white"
                    : item?.buttonVariant
                    ? "button.500"
                    : "button.500"
                }
                name="ArrowDownSLineIcon"
                isDisabled
              />
            }
            onPress={(e) => setFormData(item)}
          >
            {formObject[attributeName]
              ? formObject[attributeName][0]
              : `Select ${t(item.name)}`}
          </Button>
        </HStack>
      );
    })
  );
};

const FormPage = ({ formObject, setFormObject, setPageName, setLoading }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = React.useState({});
  const [inputs, setInputs] = React.useState(defaultInputs);

  const attributeName = formData.attributeName
    ? formData.attributeName
    : formData?.name;
  const valueArr = formObject[attributeName] ? formObject[attributeName] : [];

  const handelAddQuestion = () => {
    setLoading(true);
    setPageName("ListOfWorksheet");
  };

  return (
    <Stack space={1} mb="2">
      <FormInput
        {...{ formObject, setFormObject, formData, setFormData }}
        data={inputs}
      />
      <Box bg="white" p="5" position="sticky" bottom="0" shadow={2}>
        <Button.Group>
          {!inputs.filter((e) => e.attributeName === "number_of_questions")
            .length ? (
            <Button
              flex="1"
              variant="outline"
              onPress={(e) =>
                setInputs([...defaultInputs, ...autoGenerateInputs])
              }
            >
              {t("Auto Generate")}
            </Button>
          ) : (
            <></>
          )}
          <Button
            colorScheme="button"
            _text={{ color: "white" }}
            px="5"
            flex="1"
            onPress={handelAddQuestion}
          >
            {t("Search Questions")}
          </Button>
        </Button.Group>
      </Box>
      <Actionsheet isOpen={formData?.name} onClose={() => setFormData({})}>
        <Actionsheet.Content alignItems={"left"} bg="worksheetCard.500">
          <HStack justifyContent={"space-between"}>
            <Stack p={5} pt={2} pb="25px">
              <Text fontSize="16px" fontWeight={"600"}>
                {t(`Select ${formData?.name}`)}
              </Text>
            </Stack>
            <IconByName
              name="CloseCircleLineIcon"
              onPress={(e) => setFormData({})}
            />
          </HStack>
        </Actionsheet.Content>
        <Box bg="white" width={"100%"}>
          <Pressable
            px="5"
            pt="5"
            onPress={(e) => {
              if (
                formData?.data &&
                valueArr &&
                formData?.data?.length === valueArr?.length
              ) {
                setFormObject({ ...formObject, [formData?.attributeName]: [] });
              } else {
                setFormObject({
                  ...formObject,
                  [formData?.attributeName]: formData.data,
                });
              }
            }}
          >
            <HStack space="2" colorScheme="button" alignItems="center">
              <IconByName
                isDisabled
                color={
                  formData?.data &&
                  valueArr &&
                  formData?.data?.length === valueArr?.length
                    ? "button.500"
                    : "gray.300"
                }
                name={
                  formData?.data &&
                  valueArr &&
                  formData?.data?.length === valueArr?.length
                    ? "CheckboxLineIcon"
                    : "CheckboxBlankLineIcon"
                }
              />
              <Text>{t("Select All")}</Text>
            </HStack>
          </Pressable>
          {formData?.data &&
            formData?.data.map((value, index) => {
              return (
                <Pressable
                  px="5"
                  pt="5"
                  key={index}
                  onPress={(e) => {
                    if (valueArr.includes(value)) {
                      const newData = formObject[attributeName].filter(
                        (e) => value !== e
                      );
                      setFormObject({
                        ...formObject,
                        [attributeName]: newData,
                      });
                    } else {
                      setFormObject({
                        ...formObject,
                        [attributeName]: [...valueArr, value],
                      });
                    }
                  }}
                >
                  <HStack space="2" colorScheme="button" alignItems="center">
                    <IconByName
                      isDisabled
                      color={
                        valueArr.includes(value) ? "button.500" : "gray.300"
                      }
                      name={
                        valueArr.includes(value)
                          ? "CheckboxLineIcon"
                          : "CheckboxBlankLineIcon"
                      }
                    />
                    <Text>{value}</Text>
                  </HStack>
                </Pressable>
              );
            })}
          <Box p="5">
            <Button
              colorScheme="button"
              _text={{ color: "white" }}
              onPress={(e) => setFormData({})}
            >
              {t("SELECT")}
            </Button>
          </Box>
        </Box>
      </Actionsheet>
    </Stack>
  );
};

const ListOfWorksheet = ({
  questions,
  setQuestions,
  pageName,
  setPageName,
  filterObject,
  setFilterObject,
  worksheetName,
  setWorksheetName,
}) => {
  const { t } = useTranslation();
  const [width, Height] = useWindowSize();
  const [selectData, setSelectData] = React.useState([]);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [showModule, setShowModule] = React.useState(false);
  const [questionObject, setQuestionObject] = React.useState({});
  const [isAnswerFilter, setIsAnswerFilter] = React.useState(false);
  const [inputData, setInputData] = React.useState();

  React.useEffect(() => {
    setInputData(worksheetName);
  }, [worksheetName, pageName]);

  const handleWorksheetSubmit = () => {
    setQuestions(selectData);
    setPageName("filterData");
    setIsSuccess(true);
    setWorksheetName(inputData);
    setShowModule(false);
  };

  const handelInput = (event) => {
    if (event.target.value) setInputData(event.target.value);
  };

  const handelAddQuestionButton = () => {
    setPageName("ListOfWorksheet");
    setIsSuccess(false);
  };

  return (
    <Stack>
      {pageName === "filterData" && isSuccess ? (
        <Box bg="successAlert.500" p="5">
          <HStack justifyContent="space-between">
            <Text fontSize="14px" fontWeight="500" color="successAlertText.500">
              ({questions.length}) New Questions Added
            </Text>
            <IconByName
              name="CloseCircleLineIcon"
              color="successAlertText.500"
              p="0"
              onPress={(e) => setIsSuccess(false)}
            />
          </HStack>
        </Box>
      ) : (
        <></>
      )}
      {pageName === "ListOfWorksheet" ? (
        <Box>
          <FilterButton
            getObject={setFilterObject}
            object={filterObject}
            _actionSheet={{ bg: "worksheetCard.500" }}
            _box={{ pt: 5, px: 5 }}
            _button={{ bg: "button.50", px: "15px", py: "2" }}
            _filterButton={{
              rightIcon: "",
              bg: "white",
            }}
            resetButtonText={t("COLLAPSE")}
            filters={defaultInputs}
          />
          <Box bg="white" px="5">
            <ScrollView horizontal={true}>
              {selectData.map((item, index) => (
                <Box key={index}>
                  <Box
                    bg="viewNotification.600"
                    w="192px"
                    h="87px"
                    m="2"
                    p="3"
                    borderWidth="1"
                    borderColor="viewNotification.500"
                    rounded="lg"
                    overflow="hidden"
                  >
                    <div
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: "3",
                        WebkitBoxOrient: "vertical",
                      }}
                      dangerouslySetInnerHTML={{ __html: item.question }}
                    />
                  </Box>
                  <IconByName
                    name="CloseCircleFillIcon"
                    position="absolute"
                    top="0"
                    right="0"
                    p="0"
                    color="button.500"
                    _icon={{ size: 24 }}
                    onPress={(e) =>
                      setSelectData(
                        selectData.filter(
                          (e) => e.questionId !== item.questionId
                        )
                      )
                    }
                  />
                </Box>
              ))}
            </ScrollView>
          </Box>
        </Box>
      ) : (
        <Button
          flex="1"
          variant="ghost"
          leftIcon={<IconByName name="AddFillIcon" isDisabled />}
          bg="white"
          onPress={handelAddQuestionButton}
        >
          {t("Add more questions")}
        </Button>
      )}

      <Box bg="white" p="5">
        <ScrollView maxH={Height}>
          <VStack space="5">
            {questions.map((question, index) => (
              <QuestionBox
                isAnswerHide={!isAnswerFilter}
                _box={{ py: "12px", px: "16px" }}
                key={index}
                questionObject={question}
                {...(pageName !== "ListOfWorksheet"
                  ? {}
                  : { selectData, setSelectData })}
                infoIcon={
                  <IconByName
                    name="InformationLineIcon"
                    _icon={{ size: 15 }}
                    color="button.500"
                    onPress={(e) => setQuestionObject(question)}
                  />
                }
              />
            ))}
          </VStack>
        </ScrollView>
      </Box>
      <Box bg="white" p="5" position="sticky" bottom="0" shadow={2}>
        {pageName === "filterData" ? (
          <Button.Group>
            <Button
              colorScheme="button"
              px="5"
              flex="1"
              variant="outline"
              onPress={(e) => setPageName("FormPage")}
            >
              {t("Save As Draft")}
            </Button>
            <Button
              colorScheme="button"
              _text={{ color: "white" }}
              px="5"
              flex="1"
              onPress={(e) => setPageName("AddDescriptionPage")}
            >
              {t("Publish")}
            </Button>
          </Button.Group>
        ) : (
          <>
            <Text fontSize="10px" py="4" pb="1">
              <Text fontWeight="700">Attention:</Text>
              You have selected {selectData.length} questions to add to the
              worksheet.
            </Text>
            <Pressable onPress={(e) => setIsAnswerFilter(!isAnswerFilter)}>
              <HStack alignItems="center" space="1" pt="1" py="4">
                <IconByName
                  isDisabled
                  color={isAnswerFilter ? "button.500" : "gray.300"}
                  name={
                    isAnswerFilter
                      ? "CheckboxLineIcon"
                      : "CheckboxBlankLineIcon"
                  }
                />
                <Text fontSize="12px" fontWeight="600">
                  Include answer key in worksheet
                </Text>
              </HStack>
            </Pressable>
            <Button.Group>
              <Button
                colorScheme="button"
                px="5"
                flex="1"
                variant="outline"
                onPress={(e) => setPageName("FormPage")}
              >
                {t("Cancel")}
              </Button>
              <Button
                colorScheme="button"
                _text={{ color: "white" }}
                px="5"
                flex="1"
                onPress={(e) => {
                  setShowModule(true);
                }}
              >
                {t("ADD_TO_WORKSHEET")}
              </Button>
            </Button.Group>
          </>
        )}
        <Actionsheet
          isOpen={questionObject?.questionId}
          onClose={() => setQuestionObject({})}
        >
          <Actionsheet.Content alignItems={"left"}>
            <Stack p={5} pt={2} pb="25px" textAlign="center">
              <Text fontSize="12px" fontWeight={"500"} color="gray.400">
                {t("Maps of the world")}
              </Text>
              {/* <Text fontSize="16px" fontWeight={"600"}>
              {t("Learning Made Easy")}
            </Text> */}
            </Stack>
            <IconByName
              color="gray.300"
              position="absolute"
              top="10px"
              right="10px"
              name="CloseCircleLineIcon"
              onPress={(e) => setQuestionObject({})}
            />
          </Actionsheet.Content>
          <Box bg="white" width={"100%"} p="5">
            <VStack space="5">
              <Text
                fontSize="14px"
                fontWeight={"400"}
                color="gray.400"
                textTransform="inherit"
              >
                <div
                  dangerouslySetInnerHTML={{ __html: questionObject?.question }}
                />
              </Text>
              <VStack space="4">
                <HStack space="50px">
                  <VStack space="4">
                    <HStack space="1" alignItems="center">
                      <IconByName
                        name="AccountBoxFillIcon"
                        _icon={{ size: 12 }}
                        p="0"
                      />
                      <Text fontWeight="600" fontSize="10px">
                        {`Class: ${questionObject?.class}`}
                      </Text>
                    </HStack>

                    <HStack space="1" alignItems="center">
                      <IconByName
                        name="FileInfoLineIcon"
                        _icon={{ size: 12 }}
                        p="0"
                      />
                      <Text fontWeight="600" fontSize="10px">
                        {`Topics: ${questionObject?.topic}`}
                      </Text>
                    </HStack>

                    <HStack space="1" alignItems="center">
                      <IconByName
                        name="SurveyLineIcon"
                        _icon={{ size: 12 }}
                        p="0"
                      />
                      <Text fontWeight="600" fontSize="10px">
                        {"Source: Reasoning"}
                      </Text>
                    </HStack>

                    <HStack space="1" alignItems="center">
                      <IconByName
                        name="SurveyLineIcon"
                        _icon={{ size: 12 }}
                        p="0"
                      />
                      <Text fontWeight="600" fontSize="10px">
                        {`Language: ${questionObject?.languageCode}`}
                      </Text>
                    </HStack>
                  </VStack>
                  <VStack space="4">
                    <HStack space="1" alignItems="center">
                      <IconByName
                        name="SurveyLineIcon"
                        _icon={{ size: 12 }}
                        p="0"
                      />
                      <Text fontWeight="600" fontSize="10px">
                        {`Subject: ${questionObject?.subject}`}
                      </Text>
                    </HStack>

                    <HStack space="1" alignItems="center">
                      <IconByName
                        name="BarChart2LineIcon"
                        _icon={{ size: 12 }}
                        p="0"
                      />
                      <Text fontWeight="600" fontSize="10px">
                        {"Level: Intermediate"}
                      </Text>
                    </HStack>

                    <HStack space="1" alignItems="center">
                      <IconByName
                        name="BarChart2LineIcon"
                        _icon={{ size: 12 }}
                        p="0"
                      />
                      <Text fontWeight="600" fontSize="10px">
                        {"Outcome: Intermediate"}
                      </Text>
                    </HStack>
                  </VStack>
                </HStack>
              </VStack>
            </VStack>
          </Box>
        </Actionsheet>
        <Actionsheet isOpen={showModule} onClose={() => setShowModule(false)}>
          <Actionsheet.Content alignItems={"left"}>
            <Stack p={5} pt={2} pb="25px" textAlign="center">
              <Text fontSize="12px" fontWeight={"500"} color="gray.400">
                {t("Enter Worksheet Details")}
              </Text>
            </Stack>
          </Actionsheet.Content>
          <Box bg="white" width={"100%"} p="5">
            <FormControl isRequired>
              <FormControl.Label
                _text={{ fontSize: "14px", fontWeight: "400" }}
                mb="10px"
              >
                {t("NAME")}
              </FormControl.Label>
              <Input
                rounded="lg"
                height="48px"
                bg="white"
                variant="unstyled"
                p={"10px"}
                placeholder={t("ENTER") + " " + t("NAME")}
                onChange={handelInput}
                value={inputData ? inputData : ""}
              />
            </FormControl>
            <Button.Group>
              <Button
                colorScheme="button"
                px="5"
                flex="1"
                variant="outline"
                onPress={handleWorksheetSubmit}
              >
                {t("Skip")}
              </Button>
              <Button
                colorScheme="button"
                _text={{ color: "white" }}
                px="5"
                flex="1"
                onPress={handleWorksheetSubmit}
              >
                {t("Save")}
              </Button>
            </Button.Group>
          </Box>
        </Actionsheet>
      </Box>
    </Stack>
  );
};

const AddDescriptionPage = ({ setPageName }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = React.useState({});
  const formInput = [
    { name: "title", placeholder: "Enter Title", label: "Title" },
    {
      name: "description",
      placeholder: "Enter Description",
      label: "Description",
    },
    {
      name: "difficulty_level",
      placeholder: "Enter Difficulty level",
      label: "Difficulty level",
    },
    { name: "topics", placeholder: "Enter Topics", label: "Topics" },
    { name: "subject", placeholder: "Enter Subject", label: "Subject" },
    { name: "level", placeholder: "Enter Level", label: "Level" },
    { name: "skills", placeholder: "Enter Skills", label: "Skills" },
  ];
  return (
    <Box>
      {formInput.map((item, index) => {
        return (
          <Box key={index + item.name} p="5" bg="white">
            <FormControl>
              <FormControl.Label>
                <Text fontSize={"14px"} fontWeight="500">
                  {item.label}
                </Text>
              </FormControl.Label>
              <Input variant="filled" p={2} {...item} key={index + item.name} />
            </FormControl>
          </Box>
        );
      })}

      <Box bg="white" p="5" position="sticky" bottom="0" shadow={2}>
        <Button
          colorScheme="button"
          _text={{ color: "white" }}
          px="5"
          flex="1"
          onPress={(e) => setPageName("success")}
        >
          {t("Save and Publish")}
        </Button>
      </Box>
    </Box>
  );
};
