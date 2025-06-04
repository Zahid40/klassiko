import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Clock,
  Shield,
  Users,
  Download,
  ArrowRight,
  CheckCircle,
  Star,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  PlayCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const cardData = [
  {
    icon: FileText,
    title: "Auto-Generate Question Papers",
    description:
      "Create professional exam papers instantly with our AI-powered question bank and customizable templates.",
  },
  {
    icon: Clock,
    title: "Create & Schedule Online Quizzes",
    description:
      "Design interactive quizzes with timer controls, multiple question types, and automated scheduling.",
  },
  {
    icon: Shield,
    title: "Secure & Proctor Exams",
    description:
      "Ensure exam integrity with advanced proctoring tools and secure browser environments.",
  },
  {
    icon: Users,
    title: "Class & Performance Management",
    description:
      "Organize students, track performance, generate detailed analytics and progress reports.",
  },
  {
    icon: Download,
    title: "Export to PDF",
    description:
      "Download question papers, answer keys, and student reports in multiple formats for easy sharing.",
  },
  {
    icon: Star,
    title: "Advanced Analytics",
    description:
      "Get insights into student performance, question difficulty, and class trends with detailed analytics.",
  },
];

const stepsData = [
  {
    step: "1",
    title: "Create Class",
    description:
      "Set up your classroom, add subjects, and configure your course structure with ease.",
  },
  {
    step: "2",
    title: "Add Students",
    description:
      "Invite students to join your class through secure registration or bulk import from Excel.",
  },
  {
    step: "3",
    title: "Schedule Test",
    description:
      "Create and schedule exams or quizzes with customizable settings and time limits.",
  },
  {
    step: "4",
    title: "Get Results",
    description:
      "Receive instant results with detailed analytics, performance insights, and exportable reports.",
  },
];

const benefitsData = [
  {
    icon: CheckCircle,
    title: "Save 80% Time on Exam Preparation",
    description:
      "Automate question paper generation and reduce manual work from hours to minutes.",
  },
  {
    icon: CheckCircle,
    title: "Improve Student Engagement",
    description:
      "Interactive quizzes and instant feedback keep students motivated and engaged.",
  },
  {
    icon: CheckCircle,
    title: "Data-Driven Insights",
    description:
      "Make informed decisions with comprehensive analytics and performance tracking.",
  },
  {
    icon: CheckCircle,
    title: "Secure & Reliable",
    description:
      "Ensure exam integrity with advanced security measures and reliable systems.",
  },
];

export default function KlassikoLanding() {
  return (
    <div >
     

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary-500/5 to-white">
        <div className="container px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge
                  variant="secondary"
                  className="bg-primary-500/10 text-primary-500 border-primary-500/20"
                >
                  🎓 For Educational Institutions
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900">
                  Smarter Exam Creation
                  <span className="text-primary-500"> Starts Here</span>
                </h1>
                <p className="text-base text-neutral-600 max-w-2xl">
                  Transform your assessment process with Klassiko's intelligent
                  exam paper and quiz generator. Perfect for schools, colleges,
                  and coaching institutes.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline">
                  Request a Demo
                </Button>
              </div>
              <div className="flex items-center space-x-8 text-sm text-neutral-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Free 14-day trial</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>No credit card required</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative bg-white rounded-2xl shadow-2xl p-8 border">
                <Image
                  src="/image/studentdoingtest.png"
                  alt="Klassiko Dashboard Preview"
                  width={600}
                  height={400}
                  className="rounded-lg"
                />
                <div className="absolute -top-4 -right-4 bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Live Demo Available
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 ">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-16">
            <Badge
              variant="secondary"
              className="bg-primary-500/10 text-primary-500 border-primary-500/20"
            >
              ✨ Powerful Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900">
              Everything You Need for Modern Assessment
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Streamline your examination process with our comprehensive suite
              of tools designed for educators.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cardData.map((card, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <card.icon className="h-8 w-8 text-primary-500" />
                  </div>
                  <CardTitle className="text-xl">{card.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-neutral-600">
                    {card.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-16">
            <Badge
              variant="secondary"
              className="bg-primary-500/10 text-primary-500 border-primary-500/20"
            >
              🚀 Simple Process
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900">
              How Klassiko Works
            </h2>
            <p className=" text-neutral-600 max-w-xl mx-auto">
              Get started with your digital assessment journey in just four
              simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stepsData.map((step, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="relative">
                  <div className="relative z-10 w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl font-bold text-white">
                      {step.step}
                    </span>
                  </div>
                  {index < stepsData.length - 1 && (
                    <div className="hidden lg:block absolute top-10 left-1/2 w-full h-0.5 bg-neutral-200 -translate-y-0.5"></div>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-neutral-900">
                  {step.title}
                </h3>
                <p className="text-neutral-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section
        id="benefits"
        className="py-20 bg-gradient-to-br from-primary-500/5 to-white"
      >
        <div className="container px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge
                  variant="secondary"
                  className="bg-primary-500/10 text-primary-500 border-primary-500/20"
                >
                  💡 Why Choose Klassiko
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-900">
                  Designed for Modern Education
                </h2>
                <p className=" text-neutral-600">
                  Empower your institution with cutting-edge assessment tools
                  that save time and improve learning outcomes.
                </p>
              </div>

              <div className="space-y-6">
                {benefitsData.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <benefit.icon className="h-5 w-5 text-primary-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-neutral-600 text-sm">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <Card className="border-0 shadow-2xl">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                        Trusted by 500+ Institutions
                      </h3>
                      <p className="text-neutral-600 text-sm">
                        Join thousands of educators worldwide
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center">
                      {[
                        { value: "50K+", label: "Students Assessed" },
                        { value: "10K+", label: "Exams Created" },
                        { value: "99.9%", label: "Uptime" },
                        { value: "4.9/5", label: "User Rating" },
                      ].map((stat, index) => (
                        <div key={index} className="space-y-2">
                          <div className="text-3xl font-bold text-primary-500">
                            {stat.value}
                          </div>
                          <div className="text-sm text-neutral-600">
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 bg-white">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-16">
            <Badge
              variant="secondary"
              className="bg-primary-500/10 text-primary-500 border-primary-500/20"
            >
              🎯 See It In Action
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900">
              Experience Klassiko Live
            </h2>
            <p className=" text-neutral-600 max-w-3xl mx-auto">
              Take a tour of our platform and see how easy it is to create
              professional assessments.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <Card className="border-0 shadow-2xl overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-video text-center">
                  <Image
                    src="/image/studentdoingtest.png"
                    alt="Klassiko Platform Demo"
                    layout="fill"
                    objectFit="cover"
                    width={0}
                    height={0}
                    className=""
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                    <Button
                      size="lg"
                      className="bg-primary-500 hover:bg-[#8B002A] gap-2"
                    >
                      <PlayCircle /> Watch Demo Video
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-neutral-900">
                Ready to Get Started?
              </h3>
              <p className="text-neutral-600 max-w-2xl mx-auto ">
                Join thousands of educators who have transformed their
                assessment process with Klassiko.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white "
                >
                  Schedule Demo Call
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      

      {/* Sticky CTA Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          className="bg-primary-500 hover:bg-primary-600 shadow-lg"
          asChild
        >
          <Link href={"/login"}>
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
