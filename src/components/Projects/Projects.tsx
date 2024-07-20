import { Outlet, Link } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  Typography,
  Stack,
  Grid,
  List,
  ListItem,
  ListItemButton,
  Divider,
} from "@mui/material";
import CustomInput from "../CustomInput/CustomInput";
import { useProjectsContext } from "../../contexts/projectsContext";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

type ProjectValues = {
  projectName: string;
};

export function Projects() {
  // context
  const {
    projects,
    addProject,
    editProject,
    removeProject,
    selectedProjectIndex,
    setSelectedProjectIndex,
  } = useProjectsContext();

  // states
  const [projectInputIsOpen, setProjectInputIsOpen] = useState<boolean>(false);
  const [editedProjectIndex, setEditedProjectIndex] = useState<number>(NaN);

  // functions
  const submitNewProject = (data: ProjectValues) => {
    addProject(data.projectName);
  };

  const submitEditedProject = (data: ProjectValues) => {
    editProject(data.projectName, editedProjectIndex);
  };

  // form setup
  const projectForm = useForm<ProjectValues>({});

  const { register, handleSubmit, reset, formState } = projectForm;
  const { isSubmitSuccessful, errors } = formState;

  useEffect(() => {
    reset();
  }, [editedProjectIndex]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      setProjectInputIsOpen(false);
      setEditedProjectIndex(NaN);
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
            onSubmit={handleSubmit(submitNewProject)}
            noValidate
            autoComplete="off"
            style={{ width: "100%" }}
          >
            {projectInputIsOpen || (
              <Button
                variant="contained"
                onClick={() => {
                  setEditedProjectIndex(NaN);
                  setProjectInputIsOpen(true);
                }}
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
                <CustomInput
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
                    {editedProjectIndex === i ? (
                      <Stack
                        direction="row"
                        sx={{
                          width: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        <form
                          onSubmit={handleSubmit(submitEditedProject)}
                          noValidate
                          autoComplete="off"
                          style={{ width: "100%" }}
                        >
                          <FormControl
                            sx={{
                              mb: 2,
                              width: "100%",
                            }}
                          >
                            {editedProjectIndex >= 0 && (
                              <CustomInput
                                autoFocus
                                variant="outlined"
                                label="Name of the project"
                                id="existing-project"
                                defaultValue={
                                  editedProjectIndex >= 0
                                    ? projects[editedProjectIndex]?.projectName
                                    : ""
                                }
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
                              {editedProjectIndex >= 0
                                ? errors.projectName?.message
                                : ""}
                            </Typography>
                          </FormControl>
                          {editedProjectIndex >= 0 && (
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
                                  setEditedProjectIndex(NaN);
                                }}
                              >
                                Cancel
                              </Button>
                            </Stack>
                          )}
                        </form>
                      </Stack>
                    ) : (
                      <ListItem disablePadding>
                        <ListItemButton
                          selected={selectedProjectIndex === i}
                          onClick={() => {
                            setEditedProjectIndex(NaN);
                            setSelectedProjectIndex(i);
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
                          onClick={() => {
                            setProjectInputIsOpen(false);
                            setEditedProjectIndex(i);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          sx={{ color: "black" }}
                          onClick={() => {
                            setEditedProjectIndex(NaN);
                            removeProject(project.projectId);
                          }}
                        >
                          X
                        </Button>
                      </ListItem>
                    )}
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
