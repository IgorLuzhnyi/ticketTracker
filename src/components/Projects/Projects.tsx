import {
  Box,
  Button,
  FormControl,
  TextField,
  Typography,
  Stack,
  List,
  ListItem,
  ListItemButton,
  Divider,
} from "@mui/material";
import { useProjectsContext } from "../../contexts/projectsContext";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

type ProjectInputValues = {
  projectName: string;
};

export function Projects() {
  // context
  const {
    projects,
    addProject,
    selectedProjectIndex,
    setSelectedProjectIndex,
  } = useProjectsContext();

  // variables
  const [projectInputIsOpen, setProjectInputIsOpen] = useState<boolean>(false);

  // functions
  const submitProject = (data: ProjectInputValues) => {
    addProject(data.projectName);
  };

  // form setup
  const projectForm = useForm<ProjectInputValues>({
    defaultValues: {
      projectName: "",
    },
  });

  const { register, handleSubmit, reset, formState } = projectForm;
  const { isSubmitSuccessful, errors } = formState;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      setProjectInputIsOpen(false);
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <Box
      sx={{
        backgroundColor: "info.light",
        p: 2,
        borderRadius: ".5rem",
      }}
    >
      <form
        onSubmit={handleSubmit(submitProject)}
        noValidate
        autoComplete="off"
        style={{ width: "100%" }}
      >
        {projectInputIsOpen || (
          <Button
            variant="contained"
            onClick={() => setProjectInputIsOpen(true)}
            sx={{
              color: "secondary.main",
              backgroundColor: "info.main",
            }}
          >
            Create new project
          </Button>
        )}
        <FormControl
          sx={{
            mb: 2,
            width: "100%",
          }}
        >
          {projectInputIsOpen && (
            <TextField
              autoFocus
              variant="outlined"
              id="new-project"
              label="Name of the project"
              sx={{
                backgroundColor: "primary.light",
              }}
              {...register("projectName", {
                required: {
                  value: true,
                  message: "Project name is required",
                },
                pattern: {
                  value: /^.{1,20}$/,
                  message: "20 characters max",
                },
              })}
              error={!!errors.projectName}
            />
          )}
          <Typography variant="subtitle2" color="error">
            {projectInputIsOpen ? errors.projectName?.message : ""}
          </Typography>
        </FormControl>
        {projectInputIsOpen && (
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
            }}
          >
            <Button
              type="submit"
              variant="contained"
              sx={{
                color: "secondary.main",
                backgroundColor: "info.main",
                width: "48%",
              }}
            >
              Submit
            </Button>
            <Button
              variant="contained"
              sx={{
                color: "secondary.main",
                backgroundColor: "red",
                width: "48%",
              }}
              onClick={() => setProjectInputIsOpen(false)}
            >
              Cancel
            </Button>
          </Stack>
        )}
      </form>
      <Box
        sx={{
          mt: 2,
          color: "secondary.main",
        }}
      >
        <Typography variant="h5">Current projects:</Typography>
        <List
          sx={{
            height: "50vh",
            overflowY: "auto",
          }}
        >
          {projects.length ? (
            projects.map((project, i) => (
              <Box key={i}>
                <ListItem disablePadding>
                  <ListItemButton
                    selected={selectedProjectIndex === i}
                    onClick={() => setSelectedProjectIndex(i)}
                    sx={{
                      "&.Mui-selected": {
                        backgroundColor: "info.main",
                        "&:hover": {
                          backgroundColor: "info.main",
                        },
                      },
                      borderRadius: ".3rem",
                    }}
                  >
                    {project.projectName}
                  </ListItemButton>
                </ListItem>
                {i === projects.length - 1 ? null : (
                  <Divider
                    sx={{
                      backgroundColor: "secondary.light",
                      opacity: ".2",
                      ml: 2,
                      mr: 2,
                    }}
                  />
                )}
              </Box>
            ))
          ) : (
            <Typography>No projects yet...</Typography>
          )}
        </List>
      </Box>
    </Box>
  );
}
