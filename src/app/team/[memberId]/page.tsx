import MemberProfile from "@/layouts/memberProfile";
import { MDXRemote } from "next-mdx-remote/rsc";
import { members } from "@/data/team";
import { metadataTmpl } from "@/data/metadata";
import { promises as fs } from "fs";

interface Params {
  params: {
    memberId: string;
  };
}

function getMember(memberId: string) {
  for (let member of members) {
    if (member.id === memberId) {
      return member;
    }
  }
}

export async function generateMetadata({ params: { memberId } }: Params) {
  const member = getMember(memberId);
  return {
    ...metadataTmpl,
    title:
      metadataTmpl.title +
      " | Team" +
      (member ? ` | ${member.firstname} ${member.lastname}` : ""),
  };
}

export default async function Member({ params: { memberId } }: Params) {
  const member = getMember(memberId);
  if (!member) {
    throw new Error(`No member with id ${memberId}`);
  }

  var mdxSrc: string = "This person is too busy changing the world...";
  try {
    mdxSrc = await fs.readFile(
      process.cwd() + `/src/app/team/[memberId]/${memberId}.mdx`,
      "utf8"
    );
  } catch (e) {}

  return (
    <MemberProfile member={member}>
      <MDXRemote source={mdxSrc} />
    </MemberProfile>
  );
}

export function generateStaticParams() {
  const v = members.map((i) => ({ memberId: i.id }));
  console.log(v);
  return v;
}