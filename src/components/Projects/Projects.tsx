import { Outlet, Link } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  TextField,
  Typography,
  Stack,
  Grid,
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
    removeProject,
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

  useEffect(() => {
    setProjectInputIsOpen(false);
  }, [selectedProjectIndex]);

  return (
    <Grid container spacing={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 3 }}>
      <Grid item xl={3} lg={3} md={3} sm={3} xs={3}>
        <Box
          sx={{
            ml: 2,
            mr: 2,
            p: 2,
            backgroundColor: "info.light",
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
                  onClick={() => {
                    reset();
                    setProjectInputIsOpen(false);
                  }}
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
                        onClick={() => {
                          setSelectedProjectIndex(i);
                          // console.log(projects[i]);
                        }}
                        sx={{
                          "&.Mui-selected": {
                            backgroundColor: "info.main",
                            "&:hover": {
                              backgroundColor: "info.main",
                            },
                          },
                          borderRadius: ".3rem",
                          p: 0,
                        }}
                      >
                        <Link
                          to={`/projects/${project.projectId}/tickets`}
                          style={{
                            width: "100%",
                            padding: "5px",
                            textAlign: "center",
                          }}
                        >
                          {project.projectName}
                        </Link>
                      </ListItemButton>
                      <Button
                        sx={{ color: "black" }}
                        onClick={() => removeProject(project.projectId)}
                      >
                        X
                      </Button>
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
                    {/* <Link
                      onClick={() => {
                        console.log(projects[i], i);
                        setSelectedProjectIndex(i);
                      }}
                      to={`/projects/${project.projectId}/tickets`}
                    >
                      {project.projectName}
                    </Link>
                    <Button
                      sx={{ color: "black" }}
                      onClick={() => removeProject(project.projectId)}
                    >
                      X
                    </Button> */}
                  </Box>
                ))
              ) : (
                <Typography>No projects yet...</Typography>
              )}
            </List>
          </Box>
        </Box>
      </Grid>
      <Grid item xl={9} lg={9} md={9} sm={9} xs={9}>
        <Box
          sx={{
            mml: 2,
            mr: 2,
            p: 2,
            borderRadius: ".5rem",
            backgroundColor: "info.light",
          }}
        >
          <Outlet />
        </Box>
      </Grid>
    </Grid>
  );
}
