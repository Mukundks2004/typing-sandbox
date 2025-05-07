import "../App.css";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function DocsPage() {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sectionId = params.get("scroll");
    if (sectionId) {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  return (
    <>
      <div className="text-offset">
        <h2>Contents</h2>

        <ul className="contents">
          <a href="#/docs?scroll=getting-started">
            <li>Getting Started</li>
          </a>
          <a href="#/docs?scroll=about">
            <li>About</li>
          </a>
          <a href="#/docs?scroll=muklang">
            <li>MukLang</li>
          </a>
          <a href="#/docs?scroll=csharp">
            <li>C#</li>
          </a>
          <a href="#/docs?scroll=scala">
            <li>Scala</li>
          </a>
          <a href="#/docs?scroll=type-theory">
            <li>Type Theory</li>
          </a>
        </ul>

        <br />

        <h2 id="getting-started">Getting Started</h2>

        <p>
          To get started using the Typing Sandbox use the <kbd>:help</kbd>{" "}
          command. The simplest non-trivial type is the trivial type
          constructor:
        </p>
        <div className="code-block">
          <samp className="code-toolbar">
            $ class X &#123;&#125;
            <br />
            $ class Z&lt;T&gt; &#123;&#125;
            <br />
            $ :info X
            <br />
            X's kind is A
            <br />
            *
            <br />
            This is a proper type.
            <br />
            <br />
            $ :info Z
            <br />
            Z's kind is F&lt;A&gt;
            <br />
            * -&gt; *
            <br />
            This is a type constructor: a 1st-order-kinded type.
            <br />
            <br />
            $ :info Z&lt;X&gt;
            <br />
            Z&lt;X&gt;'s kind is A
            <br />
            *
            <br />
            This is a proper type.
            <br />
          </samp>
        </div>

        <br />

        <h2 id="about">About</h2>
        <p>
          The Typing Sandbox is an interactive REPL for investigating the
          behaviours and interactions of types in statically, strongly typed
          programming languages. To use the Sandbox first select your language
          of choice from the dropdown. As of writing, only my custom language
          MukLang is supported but there are plans to provide support for C#,
          Scala, Java, Swift and C in the near future. C# and Scala in
          particular have already been drafted. Then you may start defining
          types (and terms), and the REPL will either allow the
          declaration/definition or throw an exception. Finally, you can
          dynamically inspect the types by using commands such as{" "}
          <kbd>:info</kbd>, <kbd>:kind</kbd>, <kbd>:variance</kbd> and{" "}
          <kbd>:tree</kbd>.
        </p>

        <p>
          The REPL is self contained and powered by{" "}
          <a className="link-no-decoration" href="https://xtermjs.org/">
            Xterm.js
          </a>
          . All typing functionality is implemented in TypeScript based off the
          relevant language specification. The goal of this app is to create a
          fun and easy way for new programmers to understand the capabilities
          and limitations of the type systems of popular programming languages.
        </p>

        {/* dont forget abstarct information with types? */}

        <br />

        <h2 id="muklang">MukLang</h2>

        <p>
          MukLang is a POC that it is feasible to write a basic interpreter in
          the browser. Currently MukLang does not support typing at all, in fact
          all you can do is create variables, assign and reassign them values
          and print them. MukLang is so high up on the list because if I can
          successfully produce a working typed programming language easily, I
          might expand the scope of this project to creating more complete
          versions of the languages below beyond just their typing systems.
          Currently the following actions are valid in MukLang:{" "}
          <kbd>id = expr;</kbd>, <kbd>print expr;</kbd>. See the{" "}
          <a
            className="link-no-decoration"
            href="https://github.com/Mukundks2004/typing-sandbox"
          >
            project readme{" "}
          </a>
          for sample I/O.
        </p>

        <br />

        <h2 id="csharp">C#</h2>

        <p>
          C# is a general purpose OO langauge that features classes, interfaces
          and subtype polymorphism. It allows for types to contain metadata such
          as if they are abstract, sealed, static or partial. It is also
          classically expressive, with support for generics, generic constraints
          and declaration-site variance on interfaces. C# is an extremely
          popular language due to its simplicity, accessibility and wide range
          of features creating a pleasant experience for developers. It is a
          great starting ground for users to explore the fundamentals of typing
          and type relationships.
        </p>

        <br />

        <h2 id="scala">Scala</h2>

        <p>
          Scala is both an OO and functional language. The functional paradigm
          encourages code to be written in a certain way- it encourages making
          functions pure, making data immutable, and calling generic class
          definitions 'type constructors'. It is more involved than C# and less
          friendly to new programmers. One of Scala's more renowned features is
          its characteristic adoption of higher-kinded types for functional
          programming. The most famous of these is the Functor, which is defined
          as a trait: <samp>trait Functor[F[_]]</samp>, which has kind{" "}
          <samp>(* -&gt; *) -&gt; *</samp> (try it in the REPL!) as it is a type
          constructor that accepts a type constructor. Functors are a generic
          data structure used to map over generic data structures, such as a{" "}
          <samp>List</samp> or <samp>Future</samp>. A functor will map the
          innermost type from <samp>A</samp> to <samp>B</samp> while preserving
          the intermediary 'wrapping' type.
        </p>

        <p>
          Scala also supports both declaration-site and use-site variance,
          including variance for read-only classes. Use-site variance in
          particular works closely with Scala's upper and lower bounds on types.
          Later versions of Scala natively support union and intersection types
          using <samp>&</samp> and <samp>|</samp>. Finally, wildcards allow for
          greater flexibility than generics as they don't need to resolve to a
          single type at compile time. Wildcards in particular are{" "}
          <a
            className="link-no-decoration"
            href="https://stackoverflow.com/a/5479618/13828435"
          >
            strictly more powerful
          </a>{" "}
          than use-site variance. Good luck exploring the limits of what Scala
          will and won't type-check.
        </p>

        <br />

        <h2 id="type-theory">Type Theory</h2>
        <p>
          What does it mean for one typing system to be strictly more powerful
          than another? Well in one sense, all it means is that there are things
          you can do (types and conditions on types you can encode) in the first
          system for which there is no equivalent in the second, whilst
          everything{" "}
          <a className="link-no-decoration" href="">
            expressible
          </a>{" "}
          in the second is recreatable in the first. However, there is also a
          more nuanced answer.
        </p>

        <p>
          Type theory is a branch of pure maths concerned with the formalization
          of types and their relationships, and the encoding and expression of
          mathematical statements and proofs in the framework of type systems.
          Type theory markets itself as an alternate foundation of mathemtics,
          as opposed to the more widely recognized set theory. Unlike in set
          theory, type theory is concerned with types and terms. Through rules
          of inference one can make deductions in a{" "}
          <a
            className="link-no-decoration"
            href="https://en.wikipedia.org/wiki/Formal_system"
          >
            formal type system
          </a>
          . Using the REPL to define types and procedurally construct a program
          is similar to reasoning{" "}
          <a
            className="link-no-decoration"
            href="https://en.wikipedia.org/wiki/MU_puzzle#:~:text=contrast%20reasoning%20within%20a%20formal%20system%20(i.e.%2C%20deriving%20theorems)%20against%20reasoning%20about%20the%20formal%20system%20itself"
          >
            within a type system
          </a>
          , while type theory as a subject discusses the abilities and
          limitations of all such systems- which is equivalent to reasoning
          about a system itself.
        </p>

        <p>
          The{" "}
          <a
            className="link-no-decoration"
            href="https://en.wikipedia.org/wiki/Curry%E2%80%93Howard_correspondence"
          >
            Curry-Howard isomorphism
          </a>{" "}
          is the concept that programs in a type theory such as the{" "}
          <a
            className="link-no-decoration"
            href="https://en.wikipedia.org/wiki/Simply_typed_lambda_calculus"
          >
            simply typed lamba calculus
          </a>{" "}
          and proofs in a formal logical system such as{" "}
          <a
            className="link-no-decoration"
            href="https://en.wikipedia.org/wiki/First-order_logic"
          >
            predicate logic
          </a>{" "}
          have the same 'power'. This is because both systems are built around
          hypotheticals. A proposition <samp>A -&gt; B</samp> says that{" "}
          <i>if</i> you have <samp>A</samp>, you can procure <samp>B</samp>. A
          function <samp>A -&gt; B</samp> says that <i>if</i> it is passed an
          instance of <samp>A</samp>, it can return an instance of{" "}
          <samp>B</samp>. This formulation encourages us to think that the proof
          of a theorem is somewhat analogous to producing a term of a type, and
          so the systems are{" "}
          <a
            className="link-no-decoration"
            href="https://en.wikipedia.org/wiki/Duality_(mathematics)"
          >
            dual
          </a>
          . We can now circle back to the original question and answer: A more
          powerful type system in type theory is one that can represent more
          complex or richer mathematical structures. The more expressive a type
          system is, the more kinds of propositions and proofs it can encode.
        </p>
        <br />

        <h4>Extension: Homotopy Type Theory</h4>

        <p>
          <a
            className="link-no-decoration"
            href="https://en.wikipedia.org/wiki/Homotopy_type_theory"
          >
            HoTT
          </a>{" "}
          extends type theory through techniques developed in{" "}
          <a
            className="link-no-decoration"
            href="https://en.wikipedia.org/wiki/Homotopy_theory"
          >
            homotopy theory
          </a>
          . Homotopy theory is a branch of{" "}
          <a
            className="link-no-decoration"
            href="https://en.wikipedia.org/wiki/Algebraic_topology"
          >
            Algebraic Topology
          </a>{" "}
          concerned with examining and proving the "sameness" of topological
          spaces, such as the equivalence of S<sup>1</sup> and R<sup>2</sup> -
          &#123;0&#125;. In type theory, since there may be many terms in a
          type, it may be possible for a theorm to be true in many distinct
          ways. HoTT makes types behave less like a collection of terms and more
          like mathematical structures determined by their elements, proofs of
          equality of the elements, proofs of equality of proofs of equality of
          the elements and so on. This makes it really convenient to treat terms
          in a type like points in a topological space. After taking these
          steps, it is now possible to define spaces in a{" "}
          <a
            className="link-no-decoration"
            href="https://ncatlab.org/nlab/show/synthetic+homotopy+theory"
          >
            synthetic way{" "}
          </a>
          using the topological properties of a space without relying on
          point-based constructions.
        </p>

        <p>
          I hope you found this footnote interesting! If you have any questions,
          feel free to message me on GitHub. If you have sugestions, corrections
          or comments please submit a PR.
        </p>

        <br />
      </div>
    </>
  );
}

export default DocsPage;
